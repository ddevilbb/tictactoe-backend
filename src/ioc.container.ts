import { Container } from 'inversify';
import * as express from 'express';
import './controllers/game.controller';
import './controllers/player.controller';
import './controllers/turn.controller';
import './controllers/history.controller';
import { PlayerTransformer, PlayerTransformerInterface, PlayerTransformerType } from './transformers/player.transformer';
import { PlayerService, PlayerServiceInterface, PlayerServiceType } from './services/player.service';
import { PlayerAuth } from './middlewares/player.auth';
import { AiEasyPlayer, AiEasyPlayerType } from './players/ai.easy.player';
import { AiHardPlayer, AiHardPlayerType } from './players/ai.hard.player';
import { AiPlayerContext, AiPlayerContextInterface, AiPlayerContextType } from './contexts/ai.player.context';
import { GameService, GameServiceInterface, GameServiceType } from './services/game.service';
import { TurnService, TurnServiceInterface, TurnServiceType } from './services/turn.service';
import { AiTurnService, AiTurnServiceInterface, AiTurnServiceType } from './services/ai.turn.service';
import { GameTransformer, GameTransformerInterface, GameTransformerType } from './transformers/game.transformer';
import { TurnTransformer, TurnTransformerInterface, TurnTransformerType } from './transformers/turn.transformer';
import { AiPlayer } from './interfaces/player.interfaces';
import {
  HistoryTransformer,
  HistoryTransformerInterface,
  HistoryTransformerType
} from './transformers/history.transformer';
import { HistoryService, HistoryServiceInterface, HistoryServiceType } from './services/history.service';

let container = new Container();

// transformers
container.bind<PlayerTransformerInterface>(PlayerTransformerType).to(PlayerTransformer).inRequestScope();
container.bind<GameTransformerInterface>(GameTransformerType).to(GameTransformer).inRequestScope();
container.bind<TurnTransformerInterface>(TurnTransformerType).to(TurnTransformer).inRequestScope();
container.bind<HistoryTransformerInterface>(HistoryTransformerType).to(HistoryTransformer).inRequestScope();

// services
container.bind<PlayerServiceInterface>(PlayerServiceType).to(PlayerService).inRequestScope();
container.bind<GameServiceInterface>(GameServiceType).to(GameService).inRequestScope();
container.bind<TurnServiceInterface>(TurnServiceType).to(TurnService).inRequestScope();
container.bind<AiTurnServiceInterface>(AiTurnServiceType).to(AiTurnService).inRequestScope();
container.bind<HistoryServiceInterface>(HistoryServiceType).to(HistoryService).inRequestScope();

// players
container.bind<AiPlayer>(AiEasyPlayerType).to(AiEasyPlayer).inRequestScope();
container.bind<AiPlayer>(AiHardPlayerType).to(AiHardPlayer).inRequestScope();

// contexts
container.bind<AiPlayerContextInterface>(AiPlayerContextType).to(AiPlayerContext).inRequestScope();

const playerAuth = new PlayerAuth(container.get<PlayerServiceInterface>(PlayerServiceType));

// middlewares
container.bind<express.RequestHandler>('PlayerAuthMiddleware').toConstantValue(
  (req: any, res: any, next: any) => playerAuth.checkAuth(req, res, next)
);

export { container };
