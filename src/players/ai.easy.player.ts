import { inject, injectable } from 'inversify';
import { GameServiceInterface, GameServiceType } from '../services/game.service';
import { AiPlayer } from '../interfaces/player.interfaces';

export interface AiEasyPlayerInterface {}

@injectable()
export class AiEasyPlayer implements AiPlayer, AiEasyPlayerInterface {
  constructor(
    @inject(GameServiceType) private gameService: GameServiceInterface
  ) {}
  async getLocation(gameId: string, sign: string): Promise<number> {
    const board = await this.gameService.prepareBoard(gameId);

    return this.getRandomMove(board);
  }

  private getRandomMove(board: any[]): number {
    const turns = this.gameService.getAvailTurns(board);

    return turns[Math.floor(Math.random() * turns.length)];
  }
}

const AiEasyPlayerType = Symbol('AiPlayer');
export { AiEasyPlayerType };
