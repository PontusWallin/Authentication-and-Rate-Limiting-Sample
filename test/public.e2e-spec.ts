import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PublicModule } from '../dist/public/public.module';

describe('Public Endpoints(e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PublicModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/public/hello (GET) should say "Public Hello!"', () => {
    return request(app.getHttpServer())
      .get('/public/hello')
      .expect(200)
      .expect('Public Hello!');
  });
});
