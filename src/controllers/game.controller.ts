import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { inject, LazyServiceIdentifer } from 'inversify';
import { Response } from 'express';
import { GameServiceInterface, GameServiceType } from '../services/game.service';
import { AuthorizedRequest } from '../requests/authorized.request';

@controller('/game')
export class GameController implements interfaces.Controller {
  constructor(
    @inject(GameServiceType) private gameService: GameServiceInterface
  ) {}

  @httpPost('/new', 'PlayerAuthMiddleware')
  async new(req: AuthorizedRequest, res: Response): Promise<void> {
    res.json(await this.gameService.store(req.player.id.toHexString(), req.body));
  }

  @httpGet('/prepare_board', 'PlayerAuthMiddleware')
  async prepareBoard(req: AuthorizedRequest, res: Response): Promise<void> {
    res.json(await this.gameService.prepareBoard(req.query.gameId));
  }
}
