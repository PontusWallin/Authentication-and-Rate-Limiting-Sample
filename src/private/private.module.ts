import { Module } from '@nestjs/common';
import { PrivateController } from './private.controller';
import { PrivateService } from './private.service';

@Module({
  imports: [],
  controllers: [PrivateController],
  providers: [PrivateService],
})
export class PrivateModule {}
