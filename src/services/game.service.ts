import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { getConnection } from 'typeorm';
import { Game, GameDifficulty, GameStatus } from '../entities/game';
import { TurnServiceInterface, TurnServiceType } from './turn.service';
import { Player, PlayerSign } from '../entities/player';
import { getOtherPlayerSign } from '../helpers/player.helper';
import { GameResult } from '../interfaces/game.interfaces';
import { GameTransformerInterface, GameTransformerType } from '../transformers/game.transformer';

export interface GameServiceInterface {
  store(playerId: string, data: any): Promise<GameResult>;
  find(id: string): Promise<Game>;
  update(id: string, status: string): Promise<Game>;
  isGameOver(id: string): Promise<boolean>;
  getGameStatus(gameId: string, sign: string): Promise<string>;
  prepareBoard(gameId: string): Promise<any[]>;
  getAvailTurns(board: any[]): any[];
  checkWinCombinations(board: any[], sign: string): boolean;
}

@injectable()
export class GameService implements GameServiceInterface {
  constructor(
    @inject(TurnServiceType) private turnService: TurnServiceInterface,
    @inject(GameTransformerType) private transformer: GameTransformerInterface
  ) {}

  async store(playerId: string, data: any): Promise<GameResult> {
    const player = await getConnection().getMongoRepository(Player).findOne(playerId);
    const difficulty: GameDifficulty = data.difficulty;

    const game = Game.create({
      player,
      difficulty: difficulty
    });

    await getConnection().mongoManager.save(game);

    return this.transformer.item(game);
  }

  async find(id: string): Promise<Game> {
    return getConnection().getMongoRepository(Game).findOne(id);
  }

  async update(id: string, status: string): Promise<Game> {
    const game = await getConnection().getMongoRepository(Game).findOne(id);

    game.status = status as GameStatus;
    game.endDate = new Date();

    await getConnection().mongoManager.save(game);

    return game;
  }

  async isGameOver(id: string): Promise<boolean> {
    const board = await this.prepareBoard(id);
    const availTurns = this.getAvailTurns(board);

    if (this.checkWinCombinations(board, PlayerSign.X) ||
      this.checkWinCombinations(board, PlayerSign.O) ||
      availTurns.length === 0) {
      return true;
    }

    return false;
  }

  async getGameStatus(gameId: string, sign: string): Promise<string> {
    const board = await this.prepareBoard(gameId);
    const otherPlayerSign = getOtherPlayerSign(sign);

    switch (true) {
      case this.checkWinCombinations(board, sign):
        return GameStatus.WIN;
      case this.checkWinCombinations(board, otherPlayerSign):
        return GameStatus.LOOSE;
      default:
        return GameStatus.TIE;
    }
  }

  async prepareBoard(gameId: string): Promise<any[]> {
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8] as any[];
    const turns = await this.turnService.findByGameId(gameId);

    if (turns) {
      turns.forEach((turn) => {
        board[turn.location] = turn.playerSign;
      });
    }

    return board;
  }

  getAvailTurns(board: any[]): any[] {
    return board.filter((sign) => sign !== PlayerSign.X && sign !== PlayerSign.O);
  }

  checkWinCombinations(board: any[], sign: string): boolean {
    const combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return combinations.some((combination) => sign === board[combination[0]] && sign === board[combination[1]] && sign === board[combination[2]]);
  }
}

const GameServiceType = Symbol('GameServiceInterface');
export { GameServiceType };
