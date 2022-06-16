import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicService {
  getHello(): string {
    return 'Public Hello!';
  }
}
