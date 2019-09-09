import { GameDifficulty } from '../entities/game';
import { Player } from '../entities/player';
import { TurnResult } from './turn.interfaces';

export interface GameData {
  player: Player;
  difficulty: GameDifficulty;
}

export interface GameResult {
  id: string;
  playerId: string;
  status: string;
  difficulty: string;
  endDate: Date;
  createdAt: Date;
}

export interface HistoryGameResult {
  id: string;
  status: string;
  difficulty: string;
  turns: TurnResult[];
}
