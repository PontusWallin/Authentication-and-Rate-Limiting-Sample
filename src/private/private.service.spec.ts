import { PrivateService } from './private.service';
import { Test } from '@nestjs/testing';

describe('PrivateService', () => {
  let service: PrivateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrivateService],
    }).compile();

    service = module.get(PrivateService);
  });

  it('can create an instance of private service', async () => {
    expect(service).toBeDefined();
  });

  it('should say "Private Hello!', () => {
    const actual = service.getHello();
    expect(actual).toEqual('Private Hello!');
  });
});
