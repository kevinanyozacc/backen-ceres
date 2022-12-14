const orcl   = require('oracledb'),
      logger = require('../api/utils/logger');

const connect = async ()=>{
    let connection;
    try {
        connection = await orcl.getConnection();
        return connection
    }
    catch (err) {
        logger.error(err)
    }
   
    return
}

module.exports = {
    connect
};