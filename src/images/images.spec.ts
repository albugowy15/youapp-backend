import { Test, TestingModule } from '@nestjs/testing';
import { Images } from './images';

describe('Images', () => {
  let provider: Images;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Images],
    }).compile();

    provider = module.get<Images>(Images);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
