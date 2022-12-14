require('dotenv').config();
const express     = require('express'),
      compression = require('compression'),
      routes      = require('./api/routes/routes'),
      pino        = require('express-pino-logger'),
      logger      = require('./api/utils/logger'),
      helmet      = require("helmet");

const prefix = '/api/v1/livestock-supplies';

const app = express();

var port = process.env.PORT;

// security headers
app.use(helmet());
// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
// logger
const loggerMW = pino({
  logger: logger,
  autoLogging: true,
});
app.use(loggerMW);
// gzip compression
app.use(compression());

//routes
app.use(prefix, routes);

app.listen(port);