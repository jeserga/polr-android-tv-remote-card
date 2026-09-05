/**
 * Press handling for every control on the card.
 *
 * Pointer Events remain the primary input API, but Android WebView gets two
 * independent safety nets: native TouchEvent release listeners, and a
 * card-wide coordinator that closes any old gesture before a new one starts.
 * A press is identified by a monotonically increasing token, so delayed timer
 * callbacks can never resolve a later gesture.
 */

import { noChange, type ElementPart, type Part } from "lit";
import { directive, type PartInfo, PartType } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";

import { fireEvent } from "./kit/types";
import {
  DEFAULT_NATIVE_TOUCH_HOLD_DELAY_MS,
  NativePressStateMachine,
} from "./press-state";

/** How long to hold before the first discrete repeat. */
const REPEAT_DELAY_MS = 500;
/** Interval between discrete repeats after that. */
const REPEAT_INTERVAL_MS = 220;
/** Backstop so a repeat cannot flood the TV indefinitely. */
const MAX_REPEATS = 40;
/** Final safety release if a WebView loses every lifecycle event. */
const MAX_NATIVE_HOLD_MS = 15_000;
/** Home Assistant-style configured hold action threshold. */
const HOLD_MS = 500;
/** A deliberate mouse or keyboard hold starts a little sooner than touch. */
const DESKTOP_NATIVE_HOLD_MS = 750;
/** Window for a second tap, only when a double-tap action exists. */
const DOUBLE_TAP_MS = 250;
/** Scrollable tiles abandon a press quickly; claimed controls are more lenient. */
const SCROLL_SLOP_PX = 12;
const CLAIMED_SLOP_PX = 24;

interface CoordinatedPress {
  cancelPress(): void;
}

/**
 * Enforce one active gesture within a card.
 *
 * This also makes the next touch a recovery path: if Android omitted the old
 * pointerup, touching any other control first releases/cancels the old one.
 */
export class PressCoordinator {
  private _active?: CoordinatedPress;

  public claim(next: CoordinatedPress): void {
    if (this._active === next) return;
    const previous = this._active;
    // Install first so the previous participant cannot clear the new owner
    // while it tears itself down.
    this._active = next;
    previous?.cancelPress();
  }

  public release(participant: CoordinatedPress): void {
    if (this._active === participant) this._active = undefined;
  }

  public cancel(): void {
    const active = this._active;
    this._active = undefined;
    active?.cancelPress();
  }
}

export interface PressOptions {
  /** Runs once for a completed short press, and for each discrete repeat. */
  onPress?: () => void;
  /** Runs once after an uninterrupted native-hold threshold. */
  onPressStart?: () => void;
  /** Runs exactly once after onPressStart on every end/cancel path. */
  onPressEnd?: () => void;
  /** Runs when a configured Home Assistant hold action reaches its threshold. */
  onHold?: () => void;
  /** Runs on a second tap inside the double-tap window. */
  onDoubleTap?: () => void;
  /** Hold to repeat discrete presses. */
  repeat?: boolean;
  /** Fire Home Assistant Companion haptic feedback. */
  haptics?: boolean;
  disabled?: boolean;
  /** Claim direct input instead of allowing the gesture to become page scroll. */
  claimTouch?: boolean;
  /** Touch/pen threshold for native key hold. Mouse and keyboard stay at 750ms. */
  nativeTouchHoldDelayMs?: number;
  /** Shared by all controls rendered by one card. */
  coordinator?: PressCoordinator;
}

/** Wire pointer, keyboard, lifecycle and press feedback onto an element. */
class PressDirective extends AsyncDirective implements CoordinatedPress {
  private _element?: HTMLElement;
  private _options?: PressOptions;
  private _gestureOptions?: PressOptions;
  private _repeatTimer?: number;
  private _holdTimer?: number;
  private _nativeTimer?: number;
  private _tapTimer?: number;
  private _repeats = 0;
  private _bound = false;

  private _active = false;
  private _resolved = false;
  private _gestureId = 0;
  private _startX = 0;
  private _startY = 0;
  private _awaitingSecondTap = false;
  private _pointerId?: number;
  private _pointerType?: string;
  private _coordinator?: PressCoordinator;

  private readonly _native = new NativePressStateMachine();
  private _nativeSession?: number;

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
    if (options.disabled && this._active) this.cancelPress();
    this._options = options;
    this._element.classList.toggle(
      "press-claim-touch",
      this._claimsTouch(options),
    );

    if (!this._bound) {
      this._bound = true;
      const el = this._element;
      el.addEventListener("pointerdown", this._onPointerDown);
      el.addEventListener("pointermove", this._onPointerMove);
      el.addEventListener("pointerup", this._onPointerUp);
      el.addEventListener("pointercancel", this._onPointerCancel);
      el.addEventListener("lostpointercapture", this._onLostPointerCapture);
      el.addEventListener("pointerleave", this._onPointerLeave);
      el.addEventListener("click", this._onClick);
      el.addEventListener("dragstart", this.cancelPress);
      el.addEventListener("keydown", this._onKeyDown);
      el.addEventListener("keyup", this._onKeyUp);
      el.addEventListener("blur", this.cancelPress);
      el.addEventListener("contextmenu", this._onContextMenu);
    }
    return noChange;
  }

  /* ---------------------------------------------------------------- pointer */

  private _onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    if (this._isDirectPointer(event.pointerType) && !event.isPrimary) return;
    const options = this._options;
    if (!options || options.disabled) return;

    const gesture = this._beginGesture(options, event.pointerType || "mouse");
    this._startX = event.clientX;
    this._startY = event.clientY;
    this._pointerId = event.pointerId;

    if (this._claimsTouch(options) && this._isDirectPointer(event.pointerType)) {
      // touch-action is declared in CSS before pointerdown. preventDefault
      // additionally suppresses compatibility mouse activation/focus.
      event.preventDefault();
      try {
        this._element?.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic events cannot always be captured. Window and TouchEvent
        // fallbacks still own every release path.
      }
    }
    this._armSafety();

    if (this._isNative(options)) {
      const session = this._native.begin();
      this._nativeSession = session;
      this._holdTimer = window.setTimeout(
        () => this._startNative(gesture, session),
        this._nativeHoldDelay(options, this._pointerType),
      );
      return;
    }

    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        if (!this._isCurrent(gesture)) return;
        this._resolved = true;
        this._fire(options.onHold!, "medium", options);
      }, HOLD_MS);
      return;
    }

    if (!options.repeat || !options.onPress) return;
    const onPress = options.onPress;
    this._repeats = 0;
    this._repeatTimer = window.setTimeout(() => {
      if (!this._isCurrent(gesture)) return;
      this._resolved = true;
      this._fire(onPress, "light", options);
      this._repeatTimer = window.setInterval(() => {
        if (!this._isCurrent(gesture) || this._repeats >= MAX_REPEATS) {
          this.cancelPress();
          return;
        }
        this._repeats += 1;
        this._fire(onPress, "light", options);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  };

  private _onPointerMove = (event: PointerEvent): void => {
    if (!this._active) return;
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    if (this._native.state !== "idle") return;
    const dx = event.clientX - this._startX;
    const dy = event.clientY - this._startY;
    const slop = this._claimsTouch(this._gestureOptions)
      ? CLAIMED_SLOP_PX
      : SCROLL_SLOP_PX;
    if (dx * dx + dy * dy > slop * slop) this.cancelPress();
  };

  private _onPointerUp = (event: PointerEvent): void => {
    if (!this._active) return;
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    this._release();
  };

  private _onPointerCancel = (event: PointerEvent): void => {
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    this.cancelPress();
  };

  private _onWindowPointerUp = (event: PointerEvent): void => {
    this._onPointerUp(event);
  };

  private _onWindowPointerCancel = (event: PointerEvent): void => {
    this._onPointerCancel(event);
  };

  private _onWindowTouchEnd = (event: TouchEvent): void => {
    if (!this._active || !this._isDirectPointer(this._pointerType)) return;
    if (event.touches.length === 0) this._release();
  };

  private _onWindowTouchCancel = (): void => {
    if (this._active && this._isDirectPointer(this._pointerType)) this.cancelPress();
  };

  private _onWindowMouseUp = (event: MouseEvent): void => {
    if (this._active && this._pointerType === "mouse" && event.button === 0) {
      this._release();
    }
  };

  /** A compatibility click is the final fallback for WebViews omitting up. */
  private _onClick = (event: MouseEvent): void => {
    if (!this._active || this._pointerId === undefined) return;
    event.preventDefault();
    this._release();
  };

  private _onLostPointerCapture = (event: PointerEvent): void => {
    if (!this._active) return;
    if (this._pointerId !== undefined && event.pointerId !== this._pointerId) return;
    this.cancelPress();
  };

  private _onPointerLeave = (): void => {
    if (
      this._pointerId !== undefined &&
      this._element?.hasPointerCapture(this._pointerId)
    ) {
      return;
    }
    this.cancelPress();
  };

  private _onContextMenu = (event: Event): void => {
    event.preventDefault();
  };

  /* --------------------------------------------------------------- keyboard */

  private _onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (event.repeat) return;

    const options = this._options;
    if (!options || options.disabled) return;
    const gesture = this._beginGesture(options, "keyboard");
    this._armSafety();

    if (this._isNative(options)) {
      const session = this._native.begin();
      this._nativeSession = session;
      this._holdTimer = window.setTimeout(
        () => this._startNative(gesture, session),
        DESKTOP_NATIVE_HOLD_MS,
      );
      return;
    }

    // Preserve native button keyboard timing: activate immediately, while
    // keeping hold/repeat timers owned by this one session.
    this._resolved = true;
    this._tap(options);

    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        if (this._isCurrent(gesture)) this._fire(options.onHold!, "medium", options);
      }, HOLD_MS);
      return;
    }
    if (!options.repeat || !options.onPress) return;
    const onPress = options.onPress;
    this._repeats = 0;
    this._repeatTimer = window.setTimeout(() => {
      this._repeatTimer = window.setInterval(() => {
        if (!this._isCurrent(gesture) || this._repeats >= MAX_REPEATS) {
          this.cancelPress();
          return;
        }
        this._repeats += 1;
        this._fire(onPress, "light", options);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  };

  private _onKeyUp = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    this._release();
  };

  /* ------------------------------------------------------------------ state */

  private _beginGesture(options: PressOptions, pointerType: string): number {
    // A valid pointer cannot emit a second pointerdown before ending. Treating
    // one as a new session is therefore the safest recovery for a lost up.
    if (this._active) this.cancelPress();
    options.coordinator?.claim(this);
    this._coordinator = options.coordinator;
    this._gestureOptions = options;
    this._active = true;
    this._resolved = false;
    this._pointerType = pointerType;
    this._repeats = 0;
    this._gestureId += 1;
    this._element?.classList.add("pressed");
    return this._gestureId;
  }

  private _isCurrent(gesture: number): boolean {
    return this._active && gesture === this._gestureId;
  }

  private _startNative(gesture: number, session: number): void {
    if (!this._isCurrent(gesture)) return;
    if (this._native.hold(session) !== "start") return;
    const options = this._gestureOptions;
    if (!options?.onPressStart) return;
    this._resolved = true;
    this._holdTimer = undefined;
    this._fireNative(options.onPressStart, "light", options);
    this._nativeTimer = window.setTimeout(() => {
      if (this._isCurrent(gesture)) this.cancelPress();
    }, MAX_NATIVE_HOLD_MS);
  }

  /** Resolve a physical release as either one short tap or one native key-up. */
  private _release(): void {
    if (!this._active) return;
    if (this._nativeSession !== undefined) {
      this._finishNative(true);
      return;
    }
    const resolved = this._resolved;
    const options = this._gestureOptions ?? this._options;
    this._reset();
    if (!resolved && options) this._tap(options);
  }

  private _finishNative(released: boolean): void {
    const session = this._nativeSession;
    const options = this._gestureOptions;
    if (session === undefined || !options) {
      this._reset();
      return;
    }
    const effect = released
      ? this._native.release(session)
      : this._native.cancel(session);
    this._reset();
    if (effect === "short" && options.onPress) {
      this._tap(options);
    } else if (effect === "end" && options.onPressEnd) {
      this._fireNative(options.onPressEnd, undefined, options);
    }
  }

  /** Cancel from DOM lifecycle or from another control claiming the card. */
  public cancelPress = (): void => {
    if (!this._active) return;
    if (this._nativeSession !== undefined) this._finishNative(false);
    else this._reset();
  };

  /* ------------------------------------------------------------------ firing */

  private _tap(options: PressOptions): void {
    if (!options.onPress) return;
    const onPress = options.onPress;

    if (!options.onDoubleTap) {
      this._fire(onPress, "light", options);
      return;
    }
    if (this._awaitingSecondTap) {
      window.clearTimeout(this._tapTimer);
      this._awaitingSecondTap = false;
      this._fire(options.onDoubleTap, "light", options);
      return;
    }
    this._awaitingSecondTap = true;
    this._tapTimer = window.setTimeout(() => {
      this._awaitingSecondTap = false;
      this._fire(onPress, "light", options);
    }, DOUBLE_TAP_MS);
  }

  /** Never coalesce valid taps: transport ordering is handled by the card. */
  private _fire(run: () => void, haptic: string, options: PressOptions): void {
    if (options.haptics !== false && this._element) {
      fireEvent(this._element, "haptic", haptic);
    }
    run();
  }

  private _fireNative(
    run: () => void,
    haptic: string | undefined,
    options: PressOptions,
  ): void {
    if (haptic && options.haptics !== false && this._element) {
      fireEvent(this._element, "haptic", haptic);
    }
    run();
  }

  /* ---------------------------------------------------------------- teardown */

  private _armSafety(): void {
    if (this._pointerId !== undefined) {
      window.addEventListener("pointerup", this._onWindowPointerUp, true);
      window.addEventListener("pointercancel", this._onWindowPointerCancel, true);
      window.addEventListener("mouseup", this._onWindowMouseUp, true);
      window.addEventListener("touchend", this._onWindowTouchEnd, true);
      window.addEventListener("touchcancel", this._onWindowTouchCancel, true);
    }
    window.addEventListener("pagehide", this.cancelPress);
    window.addEventListener("beforeunload", this.cancelPress);
    window.addEventListener("blur", this.cancelPress);
    document.addEventListener("freeze", this.cancelPress);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  }

  private _onVisibilityChange = (): void => {
    if (document.hidden) this.cancelPress();
  };

  private _reset(): void {
    const element = this._element;
    const pointerId = this._pointerId;
    const pointerType = this._pointerType;
    const endedGesture = this._gestureId;
    const coordinator = this._coordinator;

    this._active = false;
    this._resolved = false;
    this._repeats = 0;
    this._nativeSession = undefined;
    this._gestureOptions = undefined;
    this._coordinator = undefined;
    element?.classList.remove("pressed");
    coordinator?.release(this);

    window.removeEventListener("pointerup", this._onWindowPointerUp, true);
    window.removeEventListener("pointercancel", this._onWindowPointerCancel, true);
    window.removeEventListener("mouseup", this._onWindowMouseUp, true);
    window.removeEventListener("touchend", this._onWindowTouchEnd, true);
    window.removeEventListener("touchcancel", this._onWindowTouchCancel, true);
    window.removeEventListener("pagehide", this.cancelPress);
    window.removeEventListener("beforeunload", this.cancelPress);
    window.removeEventListener("blur", this.cancelPress);
    document.removeEventListener("freeze", this.cancelPress);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);

    if (pointerId !== undefined) {
      try {
        if (element?.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
      } catch {
        // The browser may already have implicitly released capture.
      }
    }
    this._pointerId = undefined;
    this._pointerType = undefined;

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

    // Android WebView can apply focus after pointerup's default action. Blur
    // both now and once after that task, without stealing focus from a newer
    // gesture or from keyboard users.
    if (element && this._isDirectPointer(pointerType)) {
      element.blur();
      window.setTimeout(() => {
        if (!this._active && this._gestureId === endedGesture) element.blur();
      }, 0);
    }
  }

  private _isNative(options: PressOptions | undefined): boolean {
    return Boolean(options?.onPressStart && options.onPressEnd);
  }

  private _claimsTouch(options: PressOptions | undefined): boolean {
    return Boolean(options?.claimTouch || this._isNative(options));
  }

  private _isDirectPointer(pointerType: string | undefined): boolean {
    return pointerType === "touch" || pointerType === "pen";
  }

  private _nativeHoldDelay(options: PressOptions, pointerType: string | undefined): number {
    return this._isDirectPointer(pointerType)
      ? (options.nativeTouchHoldDelayMs ?? DEFAULT_NATIVE_TOUCH_HOLD_DELAY_MS)
      : DESKTOP_NATIVE_HOLD_MS;
  }

  protected override disconnected(): void {
    this.cancelPress();
    if (this._tapTimer !== undefined) {
      window.clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
    }
    this._awaitingSecondTap = false;
  }
}

export const press = directive(PressDirective);
