import { Controller, Get, UseGuards } from '@nestjs/common';
import { PublicService } from './public.service';
import { IPRateLimitGuard } from '../auth/ip_rate_limiting/IPRateLimitGuard';

@Controller('public')
@UseGuards(IPRateLimitGuard)
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('/hello')
  getHello(): string {
    return this.publicService.getHello();
  }
}
