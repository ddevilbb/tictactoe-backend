import { Column, Entity, ObjectID, ObjectIdColumn, OneToMany } from 'typeorm';
import { Turn } from './turn';
import { Game } from './game';
import { PlayerData } from '../interfaces/player.interfaces';
import uuid = require('uuid');

export enum PlayerType {
  HUMAN = 'human',
  AI = 'ai'
}

export enum PlayerSign {
  EMPTY = '',
  X = 'x',
  O = 'o',
}

@Entity()
export class Player implements Object {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('string')
  token: string;

  @Column('enum', { enum: PlayerType })
  type: PlayerType;

  @Column('integer', { default: 0 })
  score: number;

  @Column('enum', { enum: PlayerSign, default: PlayerSign.EMPTY })
  sign: PlayerSign;

  @OneToMany(type => Turn, turn => turn.player, { nullable: true })
  turns: Turn[];

  @OneToMany( type => Game, game => game.player)
  games: Game[];

  static create(data: PlayerData) {
    const player = new Player();

    player.token = uuid.v1();
    player.type = data.type as PlayerType;
    player.score = data.score || 0;
    player.sign = data.sign || PlayerSign.EMPTY;

    return player;
  }
}
