import { inject, injectable, LazyServiceIdentifer } from 'inversify';
import { PlayerServiceInterface, PlayerServiceType } from './player.service';
import { AiPlayerContextInterface, AiPlayerContextType } from '../contexts/ai.player.context';
import { TurnServiceInterface, TurnServiceType } from './turn.service';
import { GameServiceInterface, GameServiceType } from './game.service';
import { getConnection } from 'typeorm';

export interface AiTurnServiceInterface {
  makeTurn(gameId: string, playerSign: string, difficulty: string): Promise<any>;
}

@injectable()
export class AiTurnService implements AiTurnServiceInterface {
  constructor(
    @inject(new LazyServiceIdentifer(() => PlayerServiceType)) private playerService: PlayerServiceInterface,
    @inject(new LazyServiceIdentifer(() => AiPlayerContextType)) private aiPlayerContext: AiPlayerContextInterface,
    @inject(new LazyServiceIdentifer(() => TurnServiceType)) private turnService: TurnServiceInterface,
    @inject(new LazyServiceIdentifer(() => GameServiceType)) private gameService: GameServiceInterface
  ) {}

  async makeTurn(gameId: string, playerSign: string, difficulty: string): Promise<any> {
    const player = await this.playerService.findOrStoreAIPlayer();
    const location = await this.aiPlayerContext.makeTurn(gameId, playerSign, difficulty);

    if (player.sign.length === 0 || player.sign !== playerSign) {
      await this.playerService.saveSign(player.id, playerSign);
    }

    await this.turnService.store(gameId, player.id, location);

    return {
      gameId,
      playerId: player.id,
      location
    };
    // TODO: implement `event(new AIPlay($game_id, $player_id, $location, $player_sign));`

    // if (await this.gameService.isGameOver(gameId)) {
    //   const otherPlayerSign = this.playerService.getOtherPlayerSign(playerSign);
    //   const status = await this.gameService.getGameStatus(gameId, otherPlayerSign);
    //
    //   await this.gameService.update(gameId, status);
    //
    //   // TODO: implement `event(new GameOver($game_id, $status));`
    // }
  }
}

const AiTurnServiceType = Symbol('AiTurnServiceInterface');
export { AiTurnServiceType };
