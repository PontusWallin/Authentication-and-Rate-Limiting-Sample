import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { RateLimitResponse } from './RateLimitResponse';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;
  const testToken: { access_token: string } = { access_token: 'test_token123' };

  const MAX_REQUEST_PER_IP = '5';

  beforeEach(async () => {
    mockAuthService = {
      getToken: (): { access_token: string } => {
        return testToken;
      },
      isIPOverRateLimit: (): Promise<RateLimitResponse> => {
        return Promise<RateLimitResponse>.resolve(
          new RateLimitResponse(false, null)
        );
      }
    };

    const mockConfigService = {
      get: (key: string) => {
        if (key == 'MAX_REQUESTS_PER_IP') {
          return MAX_REQUEST_PER_IP;
        }
      },
    };

    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get(AuthController);
  });

  it('can create an instance of auth controller', async () => {
    expect(controller).toBeDefined();
  });

  it('should return a token', () => {
    const actual = controller.getToken();
    expect(actual).toEqual(testToken);
  });
});
