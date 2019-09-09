import { controller, httpGet } from 'inversify-express-utils';
import { inject } from 'inversify';
import { HistoryServiceInterface, HistoryServiceType } from '../services/history.service';
import { AuthorizedRequest } from '../requests/authorized.request';
import { Response } from 'express';

@controller('/history', 'PlayerAuthMiddleware')
export class HistoryController {
  constructor(
    @inject(HistoryServiceType) private historyService: HistoryServiceInterface
  ) {}

  @httpGet('/gameList')
  async gameList(req: AuthorizedRequest, res: Response): Promise<void> {
    res.json(await this.historyService.getGameList(req.player.id.toHexString()));
  }
}
