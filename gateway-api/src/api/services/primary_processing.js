const got   = require('got'),
     logger = require('../utils/logger');

const get = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_PRIMARY_PROCESSING +  `/${id}`, {
            searchParams: {
                cols: cols
            },
            responseType: 'json'
        });
        return response
    }catch(err){
        logger.error(err);
    }

    return response;
}

module.exports = {
	get
}
