import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrivateService } from './private.service';
import { JwtAuthGuard } from '../auth/jwt/JwtAuthGuard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('private')
export class PrivateController {
  constructor(private readonly privateService: PrivateService) {}

  @Get('/hello')
  getHello(): string {
    return this.privateService.getHello();
  }
}
