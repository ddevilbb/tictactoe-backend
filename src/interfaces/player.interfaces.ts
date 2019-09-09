import { PlayerSign, PlayerType } from '../entities/player';

export interface PlayerData {
  type: string;
  score?: number;
  sign?: PlayerSign;
}

export interface PlayerResult {
  id: string;
  token: string;
  type: string;
  score: number;
  sign?: string;
}

export interface AiPlayer {
  getLocation(gameId: string, sign: string): Promise<number>;
}
