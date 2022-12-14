const got   = require('got'),
     logger = require('../utils/logger');

const get = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_AGRICULTURAL_EXPORTER +  `/${id}`, {
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

const getCertificates = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_AGRICULTURAL_EXPORTER +  `/certificates/agricultural-exporter/${id}`, {
            searchParams: {
                cols: JSON.stringify(cols)
            },
            responseType: 'json'
        });
        return response
    } catch(err){
        logger.error(err);
    }

    return response;
}

const getCertificatesByFarmID = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_AGRICULTURAL_EXPORTER +  `/certificates/farm/${id}`, {
            searchParams: {
                cols: JSON.stringify(cols)
            },
            responseType: 'json'
        });
        return response
    } catch(err){
        logger.error(err);
    }

    return response;
}

const getCertificatesByPlantID = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_AGRICULTURAL_EXPORTER +  `/certificates/export-processing-plant/${id}`, {
            searchParams: {
                cols: JSON.stringify(cols)
            },
            responseType: 'json'
        });
        return response
    } catch(err){
        logger.error(err);
    }

    return response;
}

const getOriginCertificates = async (id, cols) => {
    let response;
    try{
        response = await got(process.env.API_AGRICULTURAL_EXPORTER +  `/origin-certificates/${id}`, {
            searchParams: {
                cols: JSON.stringify(cols)
            },
            responseType: 'json'
        });
        return response
    } catch(err){
        logger.error(err);
    }

    return response;
}

module.exports = {
	get,
    getCertificates,
    getOriginCertificates,
    getCertificatesByFarmID,
    getCertificatesByPlantID
}
