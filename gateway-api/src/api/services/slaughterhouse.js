const got   = require('got'),
     logger = require('../utils/logger');

const get = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_SLAUGHTERHOUSE +  `/${id}`, {
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

const getAuth = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_SLAUGHTERHOUSE +  `/auth/${id}`, {
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

const getCSTI = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_SLAUGHTERHOUSE +  `/csti/${id}`, {
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
    getAuth,
    getCSTI
}