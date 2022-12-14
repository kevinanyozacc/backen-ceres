const got    = require('got'),
      logger = require('../utils/logger');

const get = async (attr, value) => {
    let response;
    try{
        response = await got(process.env.API_USERS, {
            searchParams: {
                attr: attr,
                value: value
            },
            responseType: 'json'
        });
        return response.body.user[0]
    }catch(err){
        logger.error(err);
    }

    return response;
}

const getUsersTraceability = async (attr, value) => {
    let response;
    try{
        response = await got(process.env.API_USERS + '/traceability', {
            searchParams: {
                attr: attr,
                value: value
            },
            responseType: 'json'
        });
        return response.body.user
    }catch(err){
        logger.error(err);
    }

    return response;
}

const auth = async (user, pass) => {
    let response;
    try{
        response = await got(process.env.API_USERS + `/auth`, {
            searchParams: {
                user: user,
                pass: pass
            },
            responseType: 'json'
        });
        return response.body.user
    }catch(err){
        logger.error(err);
    }

    return response;
}

const update = async (id, attr, value) => {
    try{
        response = await got.patch(process.env.API_USERS + `/${id}`, {
            json: {
                attr: attr,
                value: value
            },
            responseType: 'json'
        });
        return true
    }catch(err){
        logger.error(err);
    }

    return false;
}

const create = async (data) => {
    try{
        response = await got.post(process.env.API_USERS, {
            json: data,
            responseType: 'json'
        });
        return true
    }catch(err){
        logger.error(err);
    }

    return false;
}

const getOne = async (id, attr) => {
    let response;
    try{
        response = await got(process.env.API_USERS + `/${id}/${attr}`, {
            responseType: 'json'
        });

        if (response.body.user.length <= 0) {
            return response;
        }

        return response.body.user[0][attr]
    }catch(err){
        logger.error(err);
    }

    return response;
}

const getByID = async (id) => {
    let response;
    try{
        response = await got(process.env.API_USERS + `/${id}`, {
            responseType: 'json'
        });
        return response.body.user[0]
    }catch(err){
        logger.error(err);
    }

    return response;
}

module.exports = {
    auth,
    getByID,
    getOne,
    getUsersTraceability,
    get,
    update,
    create
}