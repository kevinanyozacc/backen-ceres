const company                  = require('../models/company'),
      stats                     = require('../models/stats'),
      farm                     = require('../models/farm'),
      predios_padron           = require('../models/predios_padron'),
      san_indet_animal_detalle = require('../models/san_indet_animal_detalle');

const getStats = async (req, res) => {

    let result = await stats.get();

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

const getCompany = async (req, res) => {
    if (!req.query.cols || !req.query.where || !req.query.value){
        res.status(400).json({
            message: 'Cols, Where and Value are mandatory',
            data: []
        });
        return
    }

    let result = await company.get(req.query.cols, req.query.where, req.query.value, req.query.is_active);

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

const getFarm = async (req, res) => {
    if (!req.query.cols || !req.query.where || !req.query.value){
        res.status(400).json({
            message: 'Cols, Where and Value are mandatory',
            data: []
        });
        return
    }

    let result = await farm.get(req.query.cols, req.query.where, req.query.value);

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

const getAnimalFromPredioPadron = async (req, res) => {
    if (!req.query.cols || !req.query.where || !req.query.value){
        res.status(400).json({
            message: 'Cols, Where and Value are mandatory',
            data: []
        });
        return
    }

    let result = await predios_padron.get(req.query.cols, req.query.where, req.query.value, req.query.is_active);

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

const getAnimalFromSanIndetAnimalDetalle = async (req, res) => {
    if (!req.query.cols || !req.query.where || !req.query.value){
        res.status(400).json({
            message: 'Cols, Where and Value are mandatory',
            data: []
        });
        return
    }

    let result = await san_indet_animal_detalle.get(req.query.cols, req.query.where, req.query.value, req.query.is_active);

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
    getStats,
    getCompany,
    getFarm,
    getAnimalFromPredioPadron,
    getAnimalFromSanIndetAnimalDetalle
}
