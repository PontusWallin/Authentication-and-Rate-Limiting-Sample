import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication System and Private Endpoints (e2e)', () => {
  let app: INestApplication;
  let jwt: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('auth/token (GET)', () => {
    return request(app.getHttpServer())
      .get('/auth/token')
      .expect(200)
      .then((res) => {
        const { access_token } = res.body;
        expect(access_token).toBeDefined();
        jwt = access_token;
      });
  });

  it('/private/hello (GET) should NOT allow unauthenticated access', () => {
    return request(app.getHttpServer())
      .get('/private/hello')
      .expect(401)
      .expect('{"statusCode":401,"message":"Unauthorized"}');
  });

  it('/private/hello (GET) should allow authenticated access', async () => {
    const bearer = 'Bearer ' + jwt;
    return request(app.getHttpServer())
      .get('/private/hello')
      .set('Authorization', bearer)
      .expect(200)
      .expect('Private Hello!');
  });
});
