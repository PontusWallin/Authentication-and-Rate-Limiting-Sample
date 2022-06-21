import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RateLimitResponse } from './RateLimitResponse';
import { CacheModule } from '@nestjs/common';

const SHORT_TEST_TIME_INTERVAL = '100';
describe('AuthService', () => {
  let service: AuthService;

  const expectedToken = 'test_token123';

  const MAX_REQUESTS_PER_TOKEN = '5';
  const MAX_REQUESTS_PER_IP = '10';

  beforeEach(async () => {
    const mockJwtService = {
      sign: (): string => {
        return expectedToken;
      },
    };

    const mockConfigService = {
      get: (key: string): string => {
        if (key == 'MAX_REQUESTS_PER_IP') {
          return MAX_REQUESTS_PER_IP;
        }

        if (key == 'MAX_REQUESTS_PER_TOKEN') {
          return MAX_REQUESTS_PER_TOKEN;
        }

        if (key == 'RATE_LIMIT_RESET_TIME_IN_MILLISECONDS') {
          return SHORT_TEST_TIME_INTERVAL;
        }
      },
    };

    const module = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('returns a jwt token', async () => {
    const actual = service.getToken();
    expect(actual).toEqual({ access_token: expectedToken });
  });

  it('returns correct response when username is over rate limit ', () => {
    // setup
    for (let i = 0; i < parseInt(MAX_REQUESTS_PER_TOKEN); i++) {
      service.isUsernameOverRateLimit('test_user');
    }

    const promise = service.isUsernameOverRateLimit('test_user');
    promise.then((actual) => {
      expect(actual.isOverLimit).toEqual(true);
      expect(actual.limitResetTime).toBeDefined();
    });
  });

  it('returns correct response when username is NOT over rate limit ', () => {
    const promise = service.isUsernameOverRateLimit('test_user');
    promise.then((actual) => {
      expect(actual.isOverLimit).toEqual(false);
      expect(actual.limitResetTime).toBeNull();
    });
  });

  it('returns correct response after rate limit time is reset (username)', async () => {
    // setup
    for (let i = 0; i < parseInt(MAX_REQUESTS_PER_TOKEN); i++) {
      service.isUsernameOverRateLimit('test_user');
    }

    await new Promise((resolve) =>
      setTimeout(resolve, parseInt(SHORT_TEST_TIME_INTERVAL)),
    );

    const promise = service.isUsernameOverRateLimit('test_user');
    promise.then((actual) => {
      expect(actual).toEqual(new RateLimitResponse(false, null));
    });
  });

  it('returns correct response when IP is over rate limit ', () => {
    // setup
    for (let i = 0; i < parseInt(MAX_REQUESTS_PER_IP); i++) {
      service.isIPOverRateLimit('123.123.123');
    }

    const promise = service.isIPOverRateLimit('123.123.123');
    promise.then((actual) => {
      expect(actual.isOverLimit).toEqual(true);
      expect(actual.limitResetTime).toBeDefined();
    });
  });

  it('returns correct response when IP is NOT over rate limit ', () => {
    const promise = service.isIPOverRateLimit('123.123.123');
    promise.then((actual) => {
      expect(actual.isOverLimit).toEqual(false);
      expect(actual.limitResetTime).toBeNull();
    });
  });

  it('returns correct response after rate limit time is reset (IP address)', async () => {
    // setup
    for (let i = 0; i < parseInt(MAX_REQUESTS_PER_IP); i++) {
      service.isIPOverRateLimit('123.123.123');
    }

    await new Promise((resolve) =>
      setTimeout(resolve, parseInt(SHORT_TEST_TIME_INTERVAL)),
    );

    const promise = service.isIPOverRateLimit('123.123.123');
    promise.then((actual) => {
      expect(actual).toEqual(new RateLimitResponse(false, null));
    });
  });
});
