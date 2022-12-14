require('dotenv').config();
const express     = require('express'),
      swaggerUI   = require('swagger-ui-express'),
      docs        = require('./api/docs/docs.json'),
      compression = require('compression'),
      routes      = require('./api/routes/routes'),
      pino        = require('express-pino-logger'),
      logger      = require('./api/utils/logger'),
      helmet      = require("helmet");

const prefix = '/api/v1';

const app = express();

var port = process.env.PORT;

// Swagger UI must be before helmet
app.use('/docs', function(req, res, next){
    docs.servers[0].url = process.env.SWAGGER_URL + prefix;
    req.swaggerDoc = docs;
    next();
}, swaggerUI.serve, swaggerUI.setup());
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