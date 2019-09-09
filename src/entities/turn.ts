import { Column, Entity, JoinColumn, ManyToOne, ObjectID, ObjectIdColumn } from 'typeorm';
import { Game } from './game';
import { Player, PlayerSign } from './player';
import { TurnData } from '../interfaces/turn.interfaces';

@Entity()
export class Turn implements Object {
  @ObjectIdColumn()
  id: ObjectID;

  @ManyToOne(type => Game, game => game.turns, { onDelete: 'CASCADE', persistence: true })
  @JoinColumn({ referencedColumnName: 'id' })
  game: Game;

  @Column('string')
  gameId?: ObjectID;

  @ManyToOne(type => Player, player => player.turns, { onDelete: 'CASCADE', lazy: true })
  @JoinColumn({ referencedColumnName: 'id' })
  player: Player;

  @Column('string')
  playerId?: ObjectID;

  @Column('enum', { enum: PlayerSign, nullable: false })
  playerSign: PlayerSign;

  @Column('integer')
  location: number;

  @Column('timestamp')
  createdAt: Date;

  static create(data: TurnData) {
    const turn = new Turn();

    turn.game = data.game;
    turn.gameId = data.game.id;
    turn.player = data.player;
    turn.playerId = data.player.id;
    turn.playerSign = data.player.sign;
    turn.location = data.location;
    turn.createdAt = new Date();

    return turn;
  }
}
