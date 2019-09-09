import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { Player, PlayerSign, PlayerType } from '../entities/player';
import { getConnection } from 'typeorm';
import { PlayerTransformerInterface, PlayerTransformerType } from '../transformers/player.transformer';
import { PlayerResult } from '../interfaces/player.interfaces';

export interface PlayerServiceInterface {
  store(type: string, data?: any): Promise<PlayerResult>;
  findOrStoreAIPlayer(): Promise<PlayerResult>;
  find(data: any): Promise<PlayerResult>;
  findByToken(token: string): Promise<Player>;
  saveSign(playerId: string, sign: string): Promise<PlayerResult>;
  getOtherPlayerSign(sign: string): string;
  transformItem(player: Player): PlayerResult;
  transformList(players: Player[]): PlayerResult[];
}

@injectable()
export class PlayerService implements PlayerServiceInterface {
  constructor(
    @inject(PlayerTransformerType) private transformer: PlayerTransformerInterface
  ) {}

  async store(type: string, data?: any): Promise<PlayerResult> {
    const player = Player.create({
      type: type
    });

    await getConnection().mongoManager.save(player);

    return this.transformItem(player);
  }

  async find(data: any): Promise<PlayerResult> {
    const playerId = data.id;
    const player = await getConnection().getMongoRepository(Player).findOne(playerId);

    return this.transformItem(player);
  }

  async findByToken(token: string): Promise<Player> {
    return getConnection().getMongoRepository(Player).findOne({
      where: {
        token: token
      }
    });
  }

  async saveSign(playerId: string, sign: string): Promise<PlayerResult> {
    const player = await getConnection().getMongoRepository(Player).findOne(playerId);

    player.sign = sign as PlayerSign;

    await getConnection().mongoManager.save(player);

    return this.transformItem(player);
  }

  async findOrStoreAIPlayer(): Promise<PlayerResult> {
    let player = await getConnection().getMongoRepository(Player).findOne({
      where: {
        type: PlayerType.AI
      }
    });

    if (!player) {
      return this.store(PlayerType.AI);
    }

    return this.transformer.item(player);
  }

  getOtherPlayerSign(sign: string): string {
    return sign === PlayerSign.X ? PlayerSign.O : PlayerSign.X;
  }

  transformItem(player: Player): PlayerResult {
    return this.transformer.item(player);
  }

  transformList(players: Player[]): PlayerResult[] {
    return this.transformer.list(players);
  }
}

const PlayerServiceType = Symbol('PlayerServiceInterface');
export { PlayerServiceType };
