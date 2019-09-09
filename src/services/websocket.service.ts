import * as socketIo from 'socket.io';
import { Server } from 'http';
import { AiTurnServiceInterface, AiTurnServiceType } from './ai.turn.service';
import { container } from '../ioc.container';
import { GameServiceInterface, GameServiceType } from './game.service';
import { PlayerServiceInterface, PlayerServiceType } from './player.service';

export class WebsocketService {
  private io;
  private aiTurnService: AiTurnServiceInterface;
  private gameService: GameServiceInterface;
  private playerService: PlayerServiceInterface;

  constructor(
    server: Server
  ) {
    this.aiTurnService = container.get<AiTurnServiceInterface>(AiTurnServiceType);
    this.gameService = container.get<GameServiceInterface>(GameServiceType);
    this.playerService = container.get<PlayerServiceInterface>(PlayerServiceType);
    this.initSocket(server);
    this.listen();
  }

  private initSocket(server: Server) {
    this.io = socketIo(server);
  }

  private listen() {
    this.io.on('connection', (socket) => {
      console.log('client connected');

      socket.on('disconnect', () => {
        console.log('client disconnected');
      });

      socket.on('AIPlay', async(data: any) => {
        const otherPlayerSign = this.playerService.getOtherPlayerSign(data.sign);
        if (!await this.isGameOver(socket, data.gameId, otherPlayerSign)) {
          const turn = await this.aiTurnService.makeTurn(data.gameId, data.sign, data.difficulty);
          socket.emit('AITurn', {
            location: turn.location
          });
          await this.isGameOver(socket, data.gameId, otherPlayerSign);
        }
      });
    });
  }

  private async isGameOver(socket: any, gameId: string, sign: string): Promise<boolean> {
    const isGameOver = await this.gameService.isGameOver(gameId);

    if (isGameOver) {
      const status = await this.gameService.getGameStatus(gameId, sign);
      await this.gameService.update(gameId, status);
      socket.emit('GameOver', {
        status
      });
    }

    return isGameOver;
  }

}
