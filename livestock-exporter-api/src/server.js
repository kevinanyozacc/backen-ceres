require('dotenv').config();
const express     = require('express'),
      compression = require('compression'),
      routes      = require('./api/routes/routes'),
      pino        = require('express-pino-logger'),
      logger      = require('./api/utils/logger'),
      helmet      = require("helmet"),
      oracledb = require("oracledb");

const prefix = '/api/v1/livestock-exporter';

var port = process.env.PORT;

async function run() {
  try {
    await oracledb.createPool({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.DSN,
      poolIncrement: 0,
      poolMax: 1,
      poolMin: 1
  });

    const app = express();
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

    console.log("Server is running");
  } catch (err) {
    console.error("init() error: " + err.message);
  }
}

// Close the default connection pool with 10 seconds draining, and exit
async function closePoolAndExit() {
  console.log("\nTerminating");
  try {
    await oracledb.getPool().close(10);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

// Close the pool cleanly if Node.js is interrupted
process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

run();


