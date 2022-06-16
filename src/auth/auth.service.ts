import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequestTracker } from './RequestTracker';
import { RateLimitResponse } from './RateLimitResponse';

@Injectable()
export class AuthService {
  private MAX_REQUESTS_PER_TOKEN = this.configService.get(
    'MAX_REQUESTS_PER_TOKEN',
  );
  private MAX_REQUESTS_PER_IP = this.configService.get('MAX_REQUESTS_PER_IP');

  RequestsByUser: Map<string, RequestTracker> = new Map();
  RequestsByIPAddress: Map<string, RequestTracker> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getToken(): { access_token: string } {
    const payload = { username: 'default_user', role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  isUsernameOverRateLimit(username: string): RateLimitResponse {
    const requestTracker =
      this.RequestsByUser.get(username) || new RequestTracker();
    const timeDifference = AuthService.calculateTimeDifference(requestTracker);

    // reset rate limit if over time limit.
    if (this.isOverTimeLimit(timeDifference)) {
      this.RequestsByUser.set(username, new RequestTracker());
      return new RateLimitResponse(false, null);
    }

    // return a response if the user is over the limit.
    const numberOfPreviousRequests = requestTracker.numberOfRequests;
    if (numberOfPreviousRequests >= this.MAX_REQUESTS_PER_TOKEN) {
      return new RateLimitResponse(true, new Date(this.calculateResetAtTime()));
    }

    // if not over limit, return false
    requestTracker.addRequest();
    this.RequestsByUser.set(username, requestTracker);
    return new RateLimitResponse(false, null);
  }

  isIPOverRateLimit(ipAddress: string): RateLimitResponse {
    const requestTracker =
      this.RequestsByIPAddress.get(ipAddress) || new RequestTracker();

    const timeDifference = AuthService.calculateTimeDifference(requestTracker);
    if (this.isOverTimeLimit(timeDifference)) {
      this.RequestsByIPAddress.set(ipAddress, new RequestTracker());
      return new RateLimitResponse(false, null);
    }

    const numberOfPreviousRequests = requestTracker.numberOfRequests;
    if (numberOfPreviousRequests >= this.MAX_REQUESTS_PER_IP) {
      return new RateLimitResponse(true, this.calculateResetAtTime());
    }

    requestTracker.addRequest();
    this.RequestsByIPAddress.set(ipAddress, requestTracker);
    return new RateLimitResponse(false, null);
  }

  private static calculateTimeDifference(requestTracker: RequestTracker) {
    const currentTime = new Date();
    const timeOfFirstRequest = requestTracker.timeOfFirstRequest;

    return Math.abs(currentTime.getTime() - timeOfFirstRequest.getTime());
  }

  private calculateResetAtTime() {
    const currentTime = new Date();
    const limitResetTimeMilliseconds: number = parseInt(
      this.configService.get('RATE_LIMIT_RESET_TIME_IN_MILLISECONDS'),
    );
    const currentTimeMilliseconds = currentTime.getTime();
    return new Date(currentTimeMilliseconds + limitResetTimeMilliseconds);
  }

  private isOverTimeLimit(timeDifference: number) {
    return (
      timeDifference >
      this.configService.get('RATE_LIMIT_RESET_TIME_IN_MILLISECONDS')
    );
  }
}
