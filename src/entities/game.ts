import { Column, Entity, JoinColumn, ManyToOne, ObjectID, ObjectIdColumn, OneToMany } from 'typeorm';
import { Turn } from './turn';
import { Player } from './player';
import { GameData } from '../interfaces/game.interfaces';

export enum GameStatus {
  EMPTY = '',
  WIN = 'win',
  LOOSE = 'loose',
  TIE = 'tie'
}

export enum GameDifficulty {
  EMPTY = '',
  EASY = 'easy',
  HARD = 'hard'
}

@Entity()
export class Game implements Object {
  @ObjectIdColumn()
  id: ObjectID;

  @ManyToOne(type => Player, player => player.games)
  @JoinColumn({ referencedColumnName: 'id' })
  player: Player;

  @Column('enum', { enum: GameStatus, default: GameStatus.EMPTY })
  status: GameStatus;

  @Column('enum', { enum: GameDifficulty, default: GameDifficulty.EMPTY })
  difficulty: GameDifficulty;

  @Column('timestamp')
  endDate: Date;

  @Column('timestamp', { default: () => `now()` })
  createdAt: Date;

  @OneToMany(type => Turn, turn => turn.game)
  turns: Turn[];

  static create(data: GameData) {
    const game = new Game();

    game.player = data.player;
    game.difficulty = data.difficulty;
    game.createdAt = new Date();

    return game;
  }
}
