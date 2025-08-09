import { Test, TestingModule } from '@nestjs/testing';
import { DeepSeekController } from './deep-seek.controller';
import { DeepSeekService } from './deep-seek.service';

describe('DeepSeekController', () => {
  let controller: DeepSeekController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeepSeekController],
      providers: [DeepSeekService],
    }).compile();

    controller = module.get<DeepSeekController>(DeepSeekController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
