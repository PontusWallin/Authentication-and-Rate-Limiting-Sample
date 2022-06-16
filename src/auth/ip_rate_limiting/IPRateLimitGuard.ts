import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ThrottlerException } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IPRateLimitGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ipAddress = context.switchToHttp().getRequest().ip;
    const rateLimitResponse = this.authService.isIPOverRateLimit(ipAddress);
    if (rateLimitResponse.isOverLimit) {
      throw new ThrottlerException(
        'ThrottlerException: Too Many Requests - Your current limit is ' +
          this.configService.get('MAX_REQUESTS_PER_IP') +
          '. Try Again After ' +
          rateLimitResponse.limitResetTime.toLocaleTimeString(),
      );
    }

    return true;
  }
}
