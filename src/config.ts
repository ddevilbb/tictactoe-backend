require('dotenv').config();

const {
  APPLICATION_PORT,
  MONGO_HOST,
  MONGO_PORT,
  TYPEORM_CONNECTION,
  TYPEORM_DATABASE,
  TYPEORM_APP_USERNAME,
  TYPEORM_APP_PASSWORD,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  TYPEORM_ENTITIES_DIR
} = process.env;

export default {
  app: {
    port: parseInt(APPLICATION_PORT, 10) || 3000
  },
  typeOrm: {
    url: TYPEORM_CONNECTION + '://' + TYPEORM_APP_USERNAME + ':' + TYPEORM_APP_PASSWORD + '@' + MONGO_HOST + ':' + MONGO_PORT + '/' + TYPEORM_DATABASE,
    type: TYPEORM_CONNECTION,
    host: MONGO_HOST,
    port: MONGO_PORT,
    user: TYPEORM_APP_USERNAME,
    password: TYPEORM_APP_PASSWORD,
    synchronize: TYPEORM_SYNCHRONIZE === 'true',
    logging: TYPEORM_LOGGING === 'true',
    database: TYPEORM_DATABASE,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    entities: [
      TYPEORM_ENTITIES_DIR
    ],
    cli: {
      entitiesDir: TYPEORM_ENTITIES_DIR
    }
  }
};
