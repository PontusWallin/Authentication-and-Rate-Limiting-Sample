import { Test } from '@nestjs/testing';
import { PrivateController } from './private.controller';
import { PrivateService } from './private.service';

const expectedMessage = 'Private Hello';
describe('PrivateController', () => {
  let controller: PrivateController;
  let mockPrivateService: PrivateService;

  beforeEach(async () => {
    mockPrivateService = {
      getHello(): string {
        return expectedMessage;
      },
    };

    const module = await Test.createTestingModule({
      controllers: [PrivateController],
      providers: [
        {
          provide: PrivateService,
          useValue: mockPrivateService,
        },
      ],
    }).compile();

    controller = module.get(PrivateController);
  });

  it('can create an instance of private controller', async () => {
    expect(controller).toBeDefined();
  });

  it('should say "Private Hello" ', async () => {
    const actual = controller.getHello();
    expect(actual).toEqual(expectedMessage);
  });
});
