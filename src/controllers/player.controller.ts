import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { PlayerServiceInterface, PlayerServiceType } from '../services/player.service';
import { PlayerType } from '../entities/player';
import { AuthorizedRequest } from '../requests/authorized.request';

@controller('/player')
export class PlayerController implements interfaces.Controller {
  constructor(
    @inject(PlayerServiceType) private playerService: PlayerServiceInterface
  ) {}

  @httpPost('/new')
  async new(req: Request, res: Response): Promise<void> {
    res.json(await this.playerService.store(PlayerType.HUMAN));
  }

  @httpGet('/find', 'PlayerAuthMiddleware')
  async find(req: AuthorizedRequest, res: Response): Promise<void> {
    res.json(this.playerService.transformItem(req.player));
  }

  @httpPost('/save_sign', 'PlayerAuthMiddleware')
  async saveSign(req: AuthorizedRequest, res: Response): Promise<void> {
    res.json(await this.playerService.saveSign(req.player.id.toHexString(), req.body.sign));
  }
}
