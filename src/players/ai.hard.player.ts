import { inject, injectable } from 'inversify';
import { GameServiceInterface, GameServiceType } from '../services/game.service';
import { PlayerServiceInterface, PlayerServiceType } from '../services/player.service';
import { AiPlayer } from '../interfaces/player.interfaces';

export interface AiHardPlayerInterface {}

@injectable()
export class AiHardPlayer implements AiPlayer, AiHardPlayerInterface {
  private readonly min: number;
  private readonly max: number;
  private aiPlayer: string;
  private huPlayer: string;

  constructor(
    @inject(GameServiceType) private gameService: GameServiceInterface,
    @inject(PlayerServiceType) private playerService: PlayerServiceInterface
  ) {
    this.min = -1000;
    this.max = 1000;
  }

  async getLocation(gameId: string, sign: string): Promise<number> {
    const board = await this.gameService.prepareBoard(gameId);

    this.aiPlayer = sign;
    this.huPlayer = this.playerService.getOtherPlayerSign(sign);

    const bestMove = this.minimax(board, this.aiPlayer, 1);

    return bestMove.index;
  }

  private minimax(board: any[], player: string, step: number): any {
    const turns = this.gameService.getAvailTurns(board);

    if (this.gameService.checkWinCombinations(board, this.huPlayer)) {
      return {
        score: Math.round(this.min / step),
        step: step
      };
    } else if (this.gameService.checkWinCombinations(board, this.aiPlayer)) {
      return {
        score: Math.round(this.max / step),
        step: step
      };
    } else if (turns.length === 0) {
      return {
        score: 0,
        step: step
      };
    }

    let moves: any[] = [];

    turns.forEach((turn) => {
      let move: any = {
        index: board[turn],
        step: step
      };

      board[turn] = player;

      if (player === this.aiPlayer) {
        const result = this.minimax(board, this.huPlayer, step + 1);
        move.score = result.score;
        move.step = result.step;
      } else {
        const result = this.minimax(board, this.aiPlayer, step + 1);
        move.score = result.score;
        move.step = result.step;
      }

      board[turn] = move.index;

      moves.push(move);
    });

    let bestScore = -10000;
    let bestMove = -1;

    if (player === this.aiPlayer) {
      bestScore = -10000;
      bestMove = -1;
      moves.forEach((move, index) => {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      });
    } else {
      bestScore = 10000;
      bestMove = -1;
      moves.forEach((move, index) => {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = index;
        }
      });
    }

    return bestMove > -1 ? moves[bestMove] : null;
  }
}

const AiHardPlayerType = Symbol('AiHardPlayerInterface');
export { AiHardPlayerType };
