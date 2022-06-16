export class RateLimitResponse {
  private _isOverLimit: boolean;
  private _limitResetTime: Date;

  constructor(isOverLimit: boolean, limitResetTime: Date) {
    this._isOverLimit = isOverLimit;
    this._limitResetTime = limitResetTime;
  }

  get isOverLimit(): boolean {
    return this._isOverLimit;
  }

  get limitResetTime(): Date {
    return this._limitResetTime;
  }
}
