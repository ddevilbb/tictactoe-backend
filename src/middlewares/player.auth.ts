import { NextFunction, Response } from 'express';
import { inject } from 'inversify';
import { PlayerServiceInterface, PlayerServiceType } from '../services/player.service';
import { PlayerNotFound, TokenNotFound, WrongToken } from '../exceptions/exceptions';
import { AuthorizedRequest } from '../requests/authorized.request';
import { responseErrorWithObject } from '../helpers/responses';

export class PlayerAuth {
  constructor(
    @inject(PlayerServiceType) private playerService: PlayerServiceInterface
  ) {}

  async checkAuth(req: AuthorizedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization) {
        throw new TokenNotFound('Authorization token not found', 401);
      }

      const parts = req.headers.authorization.split(' ');

      if (parts[0] !== 'Bearer') {
        throw new WrongToken('Authorization token is wrong', 401);
      }

      const token = parts[1];

      if (token.length === 0 || token === 'undefined' || typeof token === 'undefined') {
        throw new WrongToken('Authorization token is wrong', 401);
      }

      req.player = await this.playerService.findByToken(token);

      if (!req.player) {
        throw new PlayerNotFound('Player not found', 404);
      }
    } catch (e) {
      return responseErrorWithObject(res, e, e.code);
    }

    return next();
  }
}
