import { HistoryGameResult } from '../interfaces/game.interfaces';
import { inject, injectable } from 'inversify';
import { TurnTransformerInterface, TurnTransformerType } from './turn.transformer';

export interface HistoryTransformerInterface {
  list(games: any): HistoryGameResult[];
}

@injectable()
export class HistoryTransformer implements HistoryTransformerInterface {
  constructor(
    @inject(TurnTransformerType) private turnTransformer: TurnTransformerInterface
  ) {}

  list(games: any): HistoryGameResult[] {
    return games.map(game => ({
      id: game._id.toHexString(),
      status: game.status,
      difficulty: game.difficulty,
      turns: this.turnTransformer.listAny(game.turns)
    }));
  }
}

const HistoryTransformerType = Symbol('HistoryTransformerInterface');
export { HistoryTransformerType };
