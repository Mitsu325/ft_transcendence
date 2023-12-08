import { Test, TestingModule } from '@nestjs/testing';
import { GamePong } from './game.gateway';

describe('GamePong', () => {
  let pong: GamePong;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamePong],
    }).compile();

    pong = module.get<GamePong>(GamePong);
  });

  it('should be defined', () => {
    expect(pong).toBeDefined();
  });
});
