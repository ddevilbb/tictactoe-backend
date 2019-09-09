import { PlayerSign } from '../entities/player';

export function getOtherPlayerSign(sign: string) {
  return sign === PlayerSign.X ? PlayerSign.O : PlayerSign.X;
}
