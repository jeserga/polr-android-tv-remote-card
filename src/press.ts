/**
 * Press handling for every control on the card.
 *
 * v1 wired `@click` onto bare `<div>`s: no keyboard, no screen-reader
 * semantics, no press feedback, no way to hold an arrow down. This replaces all
 * of it with one directive used everywhere, so a control cannot accidentally be
 * built without those things.
 *
 * Taps resolve on *release*, never on pointerdown. Firing on pointerdown means
 * that on a phone, putting a thumb on an app tile to scroll the page launches
 * the app — the gesture has not yet declared itself as a tap or a drag. The
 * cost is that a tap lands when the finger lifts rather than when it touches,
 * which is how every native control behaves.
 *
 * A caller can choose either repeated discrete presses or a native key-down /
 * key-up pair. Native hold is what a physical remote does, and lets each Android
 * app decide whether a held arrow seeks, scrolls or opens a context menu.
 */

import { noChange, type ElementPart, type Part } from "lit";
import { directive, type PartInfo, PartType } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";

import { fireEvent } from "./kit/types";

/** How long to hold before the first repeat. */
const REPEAT_DELAY_MS = 500;
/** Interval between repeats after that. Tuned on a real network; easy to move. */
const REPEAT_INTERVAL_MS = 220;
/** Backstop so a stuck pointer cannot flood the TV's websocket. */
const MAX_REPEATS = 40;
/** Safety release if the browser loses every pointer lifecycle event. */
const MAX_NATIVE_HOLD_MS = 30_000;
/** How long a press must last to count as a hold. Matches HA's own handler. */
const HOLD_MS = 500;
/**
 * Native Android holds deliberately use a more relaxed threshold.
 *
 * START_LONG is already classified as a long press by Android, regardless of
 * how quickly END_LONG follows. Waiting here lets an ordinary tap travel as a
 * single SHORT command and avoids turning a slightly slow thumb into a hold.
 */
const NATIVE_HOLD_DELAY_MS = 750;
/** Window for a second tap. Only applied when a double-tap action exists. */
const DOUBLE_TAP_MS = 250;
/**
 * How far a pointer may travel and still count as a tap.
 *
 * Beyond this the gesture is a scroll or a drag, and the press is abandoned.
 * Chrome's own touch slop is 8px; a little more is forgiving of thumbs without
 * making a deliberate tap hard to land.
 */
const SLOP_PX = 12;

export interface PressOptions {
  /** Runs on release, and on every repeat while held. */
  onPress?: () => void;
  /** Runs once the native-hold threshold is crossed. */
  onPressStart?: () => void;
  /** Runs exactly once after `onPressStart`, on every release/cancel path. */
  onPressEnd?: () => void;
  /**
   * Runs when the press passes the hold threshold.
   *
   * Mutually exclusive with `repeat`: a control cannot both repeat while held
   * and do something else on hold. When both are supplied, hold wins, because
   * it was configured explicitly and repeat is only ever a default.
   */
  onHold?: () => void;
  /**
   * Runs on a second tap inside the double-tap window.
   *
   * Supplying this delays the single tap by that window, since there is no way
   * to know a tap is single until it has passed. Left undefined, taps fire on
   * release — which is why it is only wired when actually configured.
   */
  onDoubleTap?: () => void;
  /** Hold to repeat. Only sensible for idempotent, directional controls. */
  repeat?: boolean;
  /** Fire HA haptic feedback (Companion app only; a no-op elsewhere). */
  haptics?: boolean;
  disabled?: boolean;
}

/**
 * Wire pointer, keyboard and press-feedback onto an element.
 *
 * Used as `<button ${press({onPress})}>`. A directive rather than a set of
 * `@pointerdown=` bindings because the listeners have to co-operate — the
 * repeat timer, the slop threshold and the `.pressed` class are one unit, and
 * splitting them across a template is how they drift apart.
 */
class PressDirective extends AsyncDirective {
  private _element?: HTMLElement;
  private _options?: PressOptions;
  private _repeatTimer?: number;
  private _holdTimer?: number;
  private _nativeTimer?: number;
  private _tapTimer?: number;
  private _repeats = 0;
  private _inFlight = false;
  private _bound = false;

  /** A press is in progress and has not yet been abandoned. */
  private _active = false;
  /** Something already fired for this press: hold, or a repeat. */
  private _resolved = false;
  private _startX = 0;
  private _startY = 0;
  private _awaitingSecondTap = false;
  /** A native-capable press is waiting to cross its hold threshold. */
  private _nativePending = false;
  private _nativeStarted = false;
  private _nativeEnd?: () => void;
  private _pointerId?: number;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error("press() can only be used on an element");
    }
  }

  override render(_options: PressOptions): typeof noChange {
    return noChange;
  }

  override update(part: Part, [options]: [PressOptions]): typeof noChange {
    this._element = (part as ElementPart).element as HTMLElement;
    this._options = options;

    if (!this._bound) {
      this._bound = true;
      const el = this._element;
      el.addEventListener("pointerdown", this._onPointerDown);
      el.addEventListener("pointermove", this._onPointerMove);
      el.addEventListener("pointerup", this._onPointerUp);
      // The browser fires pointercancel the moment it decides the gesture is a
      // scroll, which is exactly when the press must be abandoned.
      el.addEventListener("pointercancel", this._onPointerCancel);
      el.addEventListener("lostpointercapture", this._onLostPointerCapture);
      el.addEventListener("pointerleave", this._onPointerLeave);
      el.addEventListener("keydown", this._onKeyDown);
      el.addEventListener("keyup", this._onKeyUp);
      el.addEventListener("blur", this._abort);
      // Otherwise a long press pops a text-selection or context menu, which is
      // exactly the gesture hold-to-repeat needs.
      el.addEventListener("contextmenu", (event) => event.preventDefault());
    }
    return noChange;
  }

  /* ---------------------------------------------------------------- pointer */

  private _onPointerDown = (event: PointerEvent): void => {
    // Primary button only; a right-click should not drive the TV.
    if (event.button !== 0) return;
    const options = this._options;
    if (!options || options.disabled) return;
    if (this._active) return;

    // Deliberately no preventDefault and no pointer capture: both interfere
    // with the browser's own scroll detection, and this element wants that
    // detection to win.
    this._active = true;
    this._resolved = false;
    this._startX = event.clientX;
    this._startY = event.clientY;
    this._pointerId = event.pointerId;
    this._element?.classList.add("pressed");

    if (this._isNative(options)) {
      // Capture makes release reliable even if the thumb drifts outside the
      // button. It is deliberately limited to native controls; app tiles must
      // remain scrollable without launching.
      event.preventDefault();
      this._nativePending = true;
      this._nativeEnd = options.onPressEnd;
      this._armNativeSafety();
      try {
        this._element?.setPointerCapture(event.pointerId);
      } catch {
        // Some synthetic PointerEvents cannot be captured. Window-level
        // pointer listeners and the lifecycle fallbacks still catch release.
      }
      this._holdTimer = window.setTimeout(
        () => this._startNative(options),
        NATIVE_HOLD_DELAY_MS,
      );
      return;
    }

    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        if (!this._active) return;
        this._resolved = true;
        this._fire(options.onHold!, "medium");
      }, HOLD_MS);
      return;
    }

    if (!options.repeat || !options.onPress) return;
    const onPress = options.onPress;
    this._repeats = 0;
    this._repeatTimer = window.setTimeout(() => {
      if (!this._active) return;
      // Held long enough to be a repeat rather than a tap: fire the first one
      // now, so holding feels immediate from here on.
      this._resolved = true;
      this._fire(onPress);
      this._repeatTimer = window.setInterval(() => {
        if (!this._active || this._repeats >= MAX_REPEATS) {
          this._reset();
          return;
        }
        this._repeats += 1;
        this._fire(onPress);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  };

  private _onPointerMove = (event: PointerEvent): void => {
    if (!this._active) return;
    if (this._nativePending || this._nativeStarted) return;
    const dx = event.clientX - this._startX;
    const dy = event.clientY - this._startY;
    if (dx * dx + dy * dy > SLOP_PX * SLOP_PX) this._abort();
  };

  private _onPointerUp = (event: PointerEvent): void => {
    if (!this._active) return;
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    this._release();
  };

  private _onPointerCancel = (event: PointerEvent): void => {
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    this._abort();
  };

  /** Window fallback for release outside the element or a broken capture. */
  private _onWindowPointerUp = (event: PointerEvent): void => {
    this._onPointerUp(event);
  };

  private _onWindowPointerCancel = (event: PointerEvent): void => {
    this._onPointerCancel(event);
  };

  /** Losing capture unexpectedly must never leave Android holding a key. */
  private _onLostPointerCapture = (event: PointerEvent): void => {
    if (!this._active) return;
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    this._abort();
  };

  /* --------------------------------------------------------------- keyboard */

  private _onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    // Held keys arrive as a stream of keydowns; let the repeat timer own the
    // cadence instead of the OS key-repeat rate.
    if (event.repeat || this._active) return;

    const options = this._options;
    if (!options || options.disabled) return;

    // A keyboard press cannot turn into a scroll. Native mode still waits for
    // the same threshold so a quick Enter/Space is a SHORT command.
    this._active = true;
    this._resolved = false;
    this._startX = 0;
    this._startY = 0;
    this._element?.classList.add("pressed");

    if (this._isNative(options)) {
      this._nativePending = true;
      this._nativeEnd = options.onPressEnd;
      this._armNativeSafety();
      this._holdTimer = window.setTimeout(
        () => this._startNative(options),
        NATIVE_HOLD_DELAY_MS,
      );
      return;
    }

    this._resolved = true;
    this._tap();

    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        if (this._active) this._fire(options.onHold!, "medium");
      }, HOLD_MS);
      return;
    }
    if (!options.repeat || !options.onPress) return;
    const onPress = options.onPress;
    this._repeats = 0;
    this._repeatTimer = window.setTimeout(() => {
      this._repeatTimer = window.setInterval(() => {
        if (!this._active || this._repeats >= MAX_REPEATS) {
          this._reset();
          return;
        }
        this._repeats += 1;
        this._fire(onPress);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  };

  private _onKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    this._release();
  };

  /* ------------------------------------------------------------------ firing */

  /** A tap, resolving single vs double first when that distinction exists. */
  private _tap(): void {
    const options = this._options;
    if (!options) return;
    if (!options.onPress) return;
    const onPress = options.onPress;

    if (!options.onDoubleTap) {
      this._fire(onPress);
      return;
    }

    if (this._awaitingSecondTap) {
      window.clearTimeout(this._tapTimer);
      this._awaitingSecondTap = false;
      this._fire(options.onDoubleTap);
      return;
    }

    this._awaitingSecondTap = true;
    this._tapTimer = window.setTimeout(() => {
      this._awaitingSecondTap = false;
      this._fire(onPress);
    }, DOUBLE_TAP_MS);
  }

  private _fire(run: () => void, haptic = "light"): void {
    const options = this._options;
    if (!options) return;

    // Coalesce: on a slow websocket a repeat can outrun the previous call, and
    // the queue arrives long after the finger lifts.
    if (this._inFlight) return;
    this._inFlight = true;
    // Cleared on a microtask rather than awaiting the call: presses stay
    // responsive, but two cannot be issued from the same tick.
    Promise.resolve().then(() => {
      this._inFlight = false;
    });

    if (options.haptics !== false && this._element) {
      fireEvent(this._element, "haptic", haptic);
    }
    run();
  }

  /** Native START/END may be adjacent and must never be coalesced. */
  private _fireNative(run: () => void, haptic?: string): void {
    const options = this._options;
    if (!options) return;
    if (haptic && options.haptics !== false && this._element) {
      fireEvent(this._element, "haptic", haptic);
    }
    run();
  }

  /* ---------------------------------------------------------------- teardown */

  /** Give up on the current press; native mode still releases the Android key. */
  private _abort = (): void => {
    if (this._nativeStarted) this._finishNative();
    else this._reset();
  };

  private _onPointerLeave = (): void => {
    if (
      (this._nativePending || this._nativeStarted) &&
      this._pointerId !== undefined &&
      this._element?.hasPointerCapture(this._pointerId)
    ) {
      return;
    }
    this._abort();
  };

  private _isNative(options: PressOptions): boolean {
    return Boolean(options.onPressStart && options.onPressEnd);
  }

  private _armNativeSafety(): void {
    if (this._pointerId !== undefined) {
      window.addEventListener("pointerup", this._onWindowPointerUp, true);
      window.addEventListener("pointercancel", this._onWindowPointerCancel, true);
    }
    window.addEventListener("pagehide", this._abort);
    window.addEventListener("blur", this._abort);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  }

  private _onVisibilityChange = (): void => {
    if (document.hidden) this._abort();
  };

  /** Cross the threshold and send Android exactly one physical key-down. */
  private _startNative(options: PressOptions): void {
    if (!this._active || !this._nativePending || this._nativeStarted) return;
    this._nativePending = false;
    this._nativeStarted = true;
    this._resolved = true;
    this._nativeEnd = options.onPressEnd;
    this._holdTimer = undefined;
    this._fireNative(options.onPressStart!, "light");
    this._nativeTimer = window.setTimeout(
      () => this._finishNative(),
      MAX_NATIVE_HOLD_MS,
    );
  }

  /** Resolve a pointer/key release as either SHORT or END_LONG. */
  private _release(): void {
    if (!this._active) return;
    if (this._nativeStarted) {
      this._finishNative();
      return;
    }
    const resolved = this._resolved;
    this._reset();
    // A hold that reached its threshold, or a press that already started
    // repeating, has had its say. A pending native press is a normal tap.
    if (!resolved) this._tap();
  }

  /** Release a native key once, including cancel, blur and watchdog paths. */
  private _finishNative(): void {
    if (!this._nativeStarted) return;
    const end = this._nativeEnd;
    this._nativeStarted = false;
    this._nativeEnd = undefined;
    this._reset();
    if (end) this._fireNative(end);
  }

  private _reset(): void {
    this._active = false;
    this._resolved = false;
    this._nativePending = false;
    if (!this._nativeStarted) this._nativeEnd = undefined;
    this._repeats = 0;
    this._element?.classList.remove("pressed");
    window.removeEventListener("pointerup", this._onWindowPointerUp, true);
    window.removeEventListener("pointercancel", this._onWindowPointerCancel, true);
    window.removeEventListener("pagehide", this._abort);
    window.removeEventListener("blur", this._abort);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    if (this._pointerId !== undefined) {
      try {
        if (this._element?.hasPointerCapture(this._pointerId)) {
          this._element.releasePointerCapture(this._pointerId);
        }
      } catch {
        // The browser may already have released capture on pointerup/cancel.
      }
      this._pointerId = undefined;
    }
    if (this._repeatTimer !== undefined) {
      window.clearTimeout(this._repeatTimer);
      window.clearInterval(this._repeatTimer);
      this._repeatTimer = undefined;
    }
    if (this._holdTimer !== undefined) {
      window.clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
    if (this._nativeTimer !== undefined) {
      window.clearTimeout(this._nativeTimer);
      this._nativeTimer = undefined;
    }
  }

  protected override disconnected(): void {
    if (this._nativeStarted) this._finishNative();
    else this._reset();
    if (this._tapTimer !== undefined) {
      window.clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
    }
    this._awaitingSecondTap = false;
  }
}

export const press = directive(PressDirective);
