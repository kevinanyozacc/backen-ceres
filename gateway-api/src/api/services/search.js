const got    = require('got'),
      logger = require('../utils/logger');

const getStats = async () => {
    let response;
    try{
        response = await got(process.env.API_SEARCH + '/stats', {
            responseType: 'json'
        });
        return response
    }catch(err){
        logger.error(err);
    }

    return response;
}

const getCompany = async (cols, where, value, is_active) => {
    let response;
    try{
        response = await got(process.env.API_SEARCH + '/company', {
            searchParams: {
                cols: cols,
                where: where,
                value: value,
                is_active: is_active,
            },
            responseType: 'json'
        });
        return response
    }catch(err){
        logger.error(err);
    }

    return response;
}

const getFarm = async (cols, where, value) => {
    let response;
    try{
        response = await got(process.env.API_SEARCH + '/farm', {
            searchParams: {
                cols: JSON.stringify(cols),
                where: JSON.stringify(where),
                value: value,
            },
            responseType: 'json'
        });
        return response
    }catch(err){
        logger.error(err);
    }

    return response;
}

const getAnimal = async (endpoint, cols, where, value, is_active) => {
    let response;
    try{
        response = await got(process.env.API_SEARCH + '/animal' + endpoint, {
            searchParams: {
                cols: cols,
                where: where,
                value: value,
                is_active: is_active,
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
    getStats,
	getCompany,
    getFarm,
    getAnimal
}