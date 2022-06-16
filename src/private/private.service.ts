import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivateService {
  getHello(): string {
    return 'Private Hello!';
  }
}
