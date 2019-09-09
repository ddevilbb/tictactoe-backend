import { injectable } from 'inversify';
import { Game } from '../entities/game';
import { GameResult } from '../interfaces/game.interfaces';

export interface GameTransformerInterface {
  list(games: Game[]): GameResult[];
  item(game: Game): GameResult;
}

@injectable()
export class GameTransformer implements GameTransformerInterface {
  list(games: Game[]): GameResult[] {
    return games.map((game) => ({
      id: game.id.toHexString(),
      playerId: game.player.id.toHexString(),
      status: game.status,
      difficulty: game.difficulty,
      endDate: game.endDate,
      createdAt: game.createdAt
    }));
  }

  item(game: Game): GameResult {
    return {
      id: game.id.toHexString(),
      playerId: game.player.id.toHexString(),
      status: game.status,
      difficulty: game.difficulty,
      endDate: game.endDate,
      createdAt: game.createdAt
    };
  }
}

const GameTransformerType = Symbol('GameTransformerInterface');
export { GameTransformerType };
