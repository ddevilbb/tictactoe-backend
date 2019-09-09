import { Player } from '../entities/player';
import { Game } from '../entities/game';

export interface TurnData {
  game: Game;
  player: Player;
  location: number;
}

export interface TurnResult {
  id: string;
  gameId?: string;
  playerId?: string;
  playerSign: string;
  location: number;
  createdAt: Date;
}
