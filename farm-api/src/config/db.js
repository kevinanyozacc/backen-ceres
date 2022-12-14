const orcl   = require('oracledb'),
      logger = require('../api/utils/logger');

const connect = async ()=>{
    try {
        const con = await orcl.getConnection();
        return con
    }
    catch (err) {
        logger.error(err)
    }
    return
}

module.exports = {
    connect
};
