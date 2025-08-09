import { Test, TestingModule } from '@nestjs/testing';
import { DeepSeekService } from './deep-seek.service';

describe('DeepSeekService', () => {
  let service: DeepSeekService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeepSeekService],
    }).compile();

    service = module.get<DeepSeekService>(DeepSeekService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
