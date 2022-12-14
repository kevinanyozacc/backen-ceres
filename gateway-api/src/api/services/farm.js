const got   = require('got'),
     logger = require('../utils/logger');

const get = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_FARM +  `/${id}`, {
            searchParams: {
                cols: JSON.stringify(cols)
            },
            responseType: 'json'
        });
        return response
    }catch(err){
        logger.error(err);
    }

    return response;
}

const getECAS = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_FARM +  `/ecas/${id}`, {
            searchParams: {
                cols: JSON.stringify(cols)
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
	get,
    getECAS
}