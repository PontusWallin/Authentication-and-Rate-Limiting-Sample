import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { PublicService } from './public.service';
import { IPRateLimitGuard } from '../auth/ip_rate_limiting/IPRateLimitGuard';
import { Cache } from 'cache-manager';

@Controller('public')
@UseGuards(IPRateLimitGuard)
export class PublicController {
  constructor(
    private readonly publicService: PublicService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Get('/hello')
  async getHello(): Promise<string> {
    return this.publicService.getHello();
  }
}
