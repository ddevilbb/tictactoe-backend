import { injectable } from 'inversify';
import { Turn } from '../entities/turn';
import { TurnResult } from '../interfaces/turn.interfaces';

export interface TurnTransformerInterface {
  listAny(turns: any): TurnResult[];
  itemAny(turn: any): TurnResult;
  list(turns: Turn[]): TurnResult[];
  item(turn: Turn): TurnResult;
}

@injectable()
export class TurnTransformer implements TurnTransformerInterface{
  listAny(turns: any): TurnResult[] {
    return turns.map(turn => ({
      id: turn._id.toHexString(),
      gameId: turn.game.id.toHexString(),
      playerId: turn.__player__.id.toHexString(),
      playerSign: turn.playerSign.toString(),
      location: turn.location,
      createdAt: turn.createdAt
    }));
  }

  itemAny(turn: any): TurnResult {
    return {
      id: turn._id.toHexString(),
      gameId: turn.game.id.toHexString(),
      playerId: turn.__player__.id.toHexString(),
      playerSign: turn.playerSign.toString(),
      location: turn.location,
      createdAt: turn.createdAt
    };
  }

  list(turns: Turn[]): TurnResult[] {
    return turns.map(turn => ({
      id: turn.id.toHexString(),
      playerSign: turn.playerSign.toString(),
      location: turn.location,
      createdAt: turn.createdAt
    }));
  }

  item(turn: any): TurnResult {
    return {
      id: turn.id.toHexString(),
      playerSign: turn.playerSign.toString(),
      location: turn.location,
      createdAt: turn.createdAt
    };
  }
}

const TurnTransformerType = Symbol('TurnTransformerInterface');
export { TurnTransformerType };
