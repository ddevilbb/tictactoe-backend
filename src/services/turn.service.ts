import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { Turn } from '../entities/turn';
import { getConnection, ObjectID } from 'typeorm';
import { TurnTransformerInterface, TurnTransformerType } from '../transformers/turn.transformer';
import { TurnResult } from '../interfaces/turn.interfaces';
import { Game } from '../entities/game';
import { Player } from '../entities/player';

export interface TurnServiceInterface {
  store(gameId: string, playerId: string, location: number): Promise<TurnResult>;
  findByGameId(gameId: string): Promise<TurnResult[]>;
}

@injectable()
export class TurnService implements TurnServiceInterface {
  constructor(
    @inject(TurnTransformerType) private transformer: TurnTransformerInterface
  ) {}

  async store(gameId: string, playerId: string, location: number): Promise<TurnResult> {
    const game = await getConnection().getMongoRepository(Game).findOne(gameId);
    const player = await getConnection().getMongoRepository(Player).findOne(playerId);
    const turn = Turn.create({
      game,
      player,
      location
    });

    await getConnection().mongoManager.save(turn);

    return this.transformer.item(turn);
  }

  async findByGameId(gameId: string): Promise<TurnResult[]> {
    const game = await getConnection().getMongoRepository(Game).findOne(gameId);
    const turns = await getConnection().getMongoRepository(Turn).aggregate([
      {
        $match: {
          $and: [
            {
              game: game
            }
          ]
        }
      }
    ]).toArray();

    return turns.length > 0 ? this.transformer.listAny(turns) : null;
  }
}

const TurnServiceType = Symbol('TurnServiceInterface');
export { TurnServiceType };
