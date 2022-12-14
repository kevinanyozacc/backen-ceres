const centrobenef  = require('../models/centrobenef');
const authorization  = require('../models/authorization');
const csti  = require('../models/csti');

const getByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    let result = await centrobenef.getByID(req.params.id, JSON.parse(req.query.cols));

    if (!result){
        res.status(500).json({
            message: 'Database error',
            data: []
        })
        return
    }

    if (result.rows.length == 0){
        res.status(204).json()
        return
    }

    res.json({
        message: 'Results found',
        data: result.rows
    });
}


const getAuthorizationByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID and cols is mandatory',
            data: []
        });
        return
    }

    let result = await authorization.getAuth(req.params.id, JSON.parse(req.query.cols));

    if (!result){
        res.status(500).json({
            message: 'Database error',
            data: []
        })
        return
    }

    if (result.rows.length == 0){
        res.status(204).json()
        return
    }

    res.json({
        message: 'Results found',
        data: result.rows
    });
}

const getCSTIByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID and cols is mandatory',
            data: []
        });
        return
    }

    let result = await csti.getCSTI(req.params.id, JSON.parse(req.query.cols));

    if (!result){
        res.status(500).json({
            message: 'Database error',
            data: []
        })
        return
    }

    if (result.rows.length == 0){
        res.status(204).json()
        return
    }

    res.json({
        message: 'Results found',
        data: result.rows
    });
}

module.exports = {
    getByID,
    getCSTIByID,
    getAuthorizationByID
}