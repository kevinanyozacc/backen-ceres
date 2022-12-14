const pino = require('pino')

module.exports = pino(
  {
    prettyPrint: {
      colorize: true,
      translateTime: 'dd-mm-yyyy, h:MM:ss TT',
    },
  },
)