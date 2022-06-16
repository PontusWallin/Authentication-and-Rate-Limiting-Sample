import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IPRateLimitGuard } from './ip_rate_limiting/IPRateLimitGuard';

@Controller('auth')
@UseGuards(IPRateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/token')
  getToken() {
    return this.authService.getToken();
  }
}
