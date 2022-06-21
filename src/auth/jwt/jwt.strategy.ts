import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ThrottlerException } from '@nestjs/throttler';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { username: string; role: string }) {
    return this.authService
      .isUsernameOverRateLimit(payload.username)
      .then((rateLimitResponse) => {
        if (rateLimitResponse.isOverLimit) {
          throw new ThrottlerException(
            'ThrottlerException: Too Many Requests - Your current limit is ' +
              this.configService.get('MAX_REQUESTS_PER_TOKEN') +
              '. Try Again After ' +
              rateLimitResponse.limitResetTime.toLocaleTimeString(),
          );
        }

        return {
          username: payload.username,
          role: payload.role,
        };
      });
  }
}
