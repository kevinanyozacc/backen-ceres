const got   = require('got'),
     logger = require('../utils/logger');

const get = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_ANIMAL +  `/${id}`, {
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

const getByFarmID = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_ANIMAL +  `/farm/${id}`, {
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



const getByEarringID = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_ANIMAL +  `/earring/${id}`, {
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

const getEvents = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_ANIMAL +  `/events/${id}`, {
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

const saveEvent = async (data) => {
    try{
        response = await got.post(process.env.API_ANIMAL + `/events`, {
            json: data,
            responseType: 'json'
        });
        return true
    }catch(err){
        logger.error(err);
    }

    return false;
}

module.exports = {
	get,
    getByEarringID,
    getEvents,
    getByFarmID,
    saveEvent
}
