export class RequestTracker {
  constructor() {
    this._numberOfRequests = 0;
    this._timeOfFirstRequest = new Date();
  }

  public _numberOfRequests: number;

  public _timeOfFirstRequest: Date;

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
