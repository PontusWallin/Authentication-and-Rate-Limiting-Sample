export class RequestTracker {
  constructor() {
    this._numberOfRequests = 0;
    this._timeOfFirstRequest = new Date();
  }

  private _numberOfRequests: number;

  private _timeOfFirstRequest: Date;

  get numberOfRequests(): number {
    return this._numberOfRequests;
  }

  get timeOfFirstRequest(): Date {
    return this._timeOfFirstRequest;
  }

  public addRequest() {
    this._numberOfRequests++;
  }
}
