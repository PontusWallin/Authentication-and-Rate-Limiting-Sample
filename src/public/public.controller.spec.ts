import { Test } from '@nestjs/testing';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { RateLimitResponse } from '../auth/RateLimitResponse';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';

const expectedMessage = 'Public Hello';
describe('PublicController', () => {
  let controller: PublicController;
  let mockPublicService: PublicService;

  const MAX_REQUEST_PER_IP = '5';

  beforeEach(async () => {
    mockPublicService = {
      getHello(): string {
        return expectedMessage;
      },
    };

    const mockAuthService = {
      isIPOverRateLimit: (): RateLimitResponse => {
        return new RateLimitResponse(false, null);
      },
    };

    const mockConfigService = {
      get: (key: string) => {
        if (key == 'MAX_REQUESTS_PER_IP') {
          return MAX_REQUEST_PER_IP;
        }
      },
    };

    const module = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PublicController],
      providers: [
        {
          provide: PublicService,
          useValue: mockPublicService,
        },
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

    controller = module.get(PublicController);
  });

  it('can create an instance of private controller', async () => {
    expect(controller).toBeDefined();
  });

  it('should say "Public Hello" ', async () => {
    const promise = controller.getHello();
    promise.then((actual) => {
      expect(actual).toEqual(expectedMessage);
    });
  });
});
