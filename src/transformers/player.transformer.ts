import { injectable } from 'inversify';
import { Player } from '../entities/player';
import { PlayerResult } from '../interfaces/player.interfaces';

export interface PlayerTransformerInterface {
  list(players: Player[]): PlayerResult[];
  item(player: Player): PlayerResult;
}

@injectable()
export class PlayerTransformer implements PlayerTransformerInterface{
  list(players: Player[]): PlayerResult[] {
    return players.map(p => ({
      id: p.id.toHexString(),
      token: p.token,
      type: p.type,
      score: p.score,
      sign: p.sign || '',
    })) as PlayerResult[];
  }

  item(player: Player): PlayerResult {
    return {
      id: player.id.toHexString(),
      token: player.token,
      type: player.type,
      score: player.score,
      sign: player.sign || '',
    };
  }
}

const PlayerTransformerType = Symbol('PlayerTransformerInterface');
export { PlayerTransformerType };
