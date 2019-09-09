import { inject, injectable } from 'inversify';
import { HistoryGameResult } from '../interfaces/game.interfaces';
import { getConnection } from 'typeorm';
import { Game } from '../entities/game';
import { Player } from '../entities/player';
import { HistoryTransformerInterface, HistoryTransformerType } from '../transformers/history.transformer';

export interface HistoryServiceInterface {
  getGameList(playerId: string): Promise<HistoryGameResult[]>;
}

@injectable()
export class HistoryService implements HistoryServiceInterface {
  constructor(
    @inject(HistoryTransformerType) private transformer: HistoryTransformerInterface
  ) {}
  async getGameList(playerId: string): Promise<HistoryGameResult[]> {
    const player = await getConnection().getMongoRepository(Player).findOne(playerId);
    const games = await getConnection().getMongoRepository(Game).aggregate([
      {
        $match: {
          $and: [
            {
              player: player
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'turn',
          localField: '_id',
          foreignField: 'gameId',
          as: 'turns'
        }
      }
    ]).toArray();

    return this.transformer.list(games);
  }
}

const HistoryServiceType = Symbol('HistoryServiceInterface');
export { HistoryServiceType };
