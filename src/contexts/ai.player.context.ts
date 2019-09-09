import { injectable } from 'inversify';
import { GameDifficulty } from '../entities/game';
import { AiEasyPlayerType } from '../players/ai.easy.player';
import { container } from '../ioc.container';
import { AiHardPlayerType } from '../players/ai.hard.player';
import { AiPlayer } from '../interfaces/player.interfaces';

export interface AiPlayerContextInterface {
  makeTurn(gameId: string, sign: string, difficulty: string): Promise<number>;
}

@injectable()
export class AiPlayerContext implements AiPlayerContextInterface {
  private player: AiPlayer;

  async makeTurn(gameId: string, sign: string, difficulty: string): Promise<number> {
    await this.initPlayer(difficulty);
    return this.player.getLocation(gameId, sign);
  }

  private async initPlayer(difficulty: string): Promise<void> {
    switch (difficulty) {
      case GameDifficulty.EASY:
        this.player = container.get<AiPlayer>(AiEasyPlayerType);
        break;
      case GameDifficulty.HARD:
        this.player = container.get<AiPlayer>(AiHardPlayerType);
        break;
      default:
        // TODO: implement throw Error
        break;
    }
  }
}

const AiPlayerContextType = Symbol('AiPlayerContextInterface');
export { AiPlayerContextType };
