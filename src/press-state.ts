/**
 * Deterministic state for one native Android key gesture.
 *
 * DOM events and timers are deliberately kept out of this class.  The browser
 * adapter gives every physical contact a monotonically increasing session id,
 * so a late timeout from an earlier tap cannot turn a later tap into a hold.
 */

type NativePressState = "idle" | "pending" | "held";
type NativePressEffect = "short" | "start" | "end";

export const DEFAULT_NATIVE_TOUCH_HOLD_DELAY_MS = 1_000;
export const MIN_NATIVE_TOUCH_HOLD_DELAY_MS = 750;
export const MAX_NATIVE_TOUCH_HOLD_DELAY_MS = 2_000;

export class NativePressStateMachine {
  private _state: NativePressState = "idle";
  private _session = 0;

  public get state(): NativePressState {
    return this._state;
  }

  public get session(): number {
    return this._session;
  }

  /** Begin a fresh contact, invalidating every earlier timer token. */
  public begin(): number {
    this._session += 1;
    this._state = "pending";
    return this._session;
  }

  /** Cross the hold threshold for this session exactly once. */
  public hold(session: number): NativePressEffect | undefined {
    if (session !== this._session || this._state !== "pending") return undefined;
    this._state = "held";
    return "start";
  }

  /** A physical release is a short tap while pending, or key-up while held. */
  public release(session: number): NativePressEffect | undefined {
    if (session !== this._session) return undefined;
    if (this._state === "pending") {
      this._state = "idle";
      return "short";
    }
    if (this._state === "held") {
      this._state = "idle";
      return "end";
    }
    return undefined;
  }

  /** Cancellation suppresses a pending tap, but must release a held key. */
  public cancel(session: number = this._session): NativePressEffect | undefined {
    if (session !== this._session) return undefined;
    if (this._state === "held") {
      this._state = "idle";
      return "end";
    }
    if (this._state === "pending") this._state = "idle";
    return undefined;
  }
}
