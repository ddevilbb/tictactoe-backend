import * as http from 'http';
import 'reflect-metadata';
import app from '../app';
import { ConnectionOptions, createConnection } from 'typeorm';
import config from '../config';
import { WebsocketService } from '../services/websocket.service';

const httpServer = http.createServer(app);
const ormOptions: ConnectionOptions = config.typeOrm as ConnectionOptions;

createConnection(ormOptions).then(async connection => {
  const wss = new WebsocketService(httpServer);
  httpServer.listen(config.app.port);
}).catch(error => console.log('TypeORM connection error: ', error));
