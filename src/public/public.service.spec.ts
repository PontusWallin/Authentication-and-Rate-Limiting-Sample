import { Test } from '@nestjs/testing';
import { PublicService } from './public.service';

describe('PublicService', () => {
  let service: PublicService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PublicService],
    }).compile();

    service = module.get(PublicService);
  });

  it('can create an instance of public service', async () => {
    expect(service).toBeDefined();
  });

  it('should say "Public Hello!', () => {
    const actual = service.getHello();
    expect(actual).toEqual('Public Hello!');
  });
});
