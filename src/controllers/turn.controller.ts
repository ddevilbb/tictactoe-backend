import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { TurnServiceInterface, TurnServiceType } from '../services/turn.service';
import { inject } from 'inversify';
import { AuthorizedRequest } from '../requests/authorized.request';
import { Response } from 'express';

@controller('/turn', 'PlayerAuthMiddleware')
export class TurnController implements interfaces.Controller {
  constructor(
    @inject(TurnServiceType) private turnService: TurnServiceInterface
  ) {}

  @httpPost('/new')
  async new(req: AuthorizedRequest, res: Response): Promise<void> {
    res.json(await this.turnService.store(req.body.gameId, req.player.id.toHexString(), req.body.location));
  }
}
