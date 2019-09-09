import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './ioc.container';
import * as bodyParser from 'body-parser';
import cors = require('cors');
import handle from './middlewares/error.handler';

const app: Application = express();

let server = new InversifyExpressServer(container, null, null, app);

server.setConfig((app) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(cors());
});

server.setErrorConfig((app) => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({
      statusCode: 404,
      error: 'Route is not found'
    });
  });

  // exceptions handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => handle(err, req, res, next));
});

export default server.build();
