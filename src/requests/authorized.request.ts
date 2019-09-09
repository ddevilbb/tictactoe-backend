import { Player } from '../entities/player';
import { Request } from 'express';

export interface AuthorizedRequest extends Request {
  player?: Player;
  body: any;
}
