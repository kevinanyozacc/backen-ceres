const agricultural_exporter  = require('../models/agricultural_exporter');
const certificates  = require('../models/export_certificate');

const getByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    let result = await agricultural_exporter.getByID(req.params.id, JSON.parse(req.query.cols));

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

const getCertificateByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID and cols is mandatory',
            data: []
        });
        return
    }

    let result = await certificates.getCertificates(req.params.id, JSON.parse(req.query.cols));

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


const getCertificateByFarmID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID and cols is mandatory',
            data: []
        });
        return
    }

    let result = await certificates.getCertificatesByFarmID(req.params.id, JSON.parse(req.query.cols));

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

const getCertificatesByPlantID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID and cols is mandatory',
            data: []
        });
        return
    }

    let result = await certificates.getCertificatesByPlantID(req.params.id, JSON.parse(req.query.cols));

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
    getCertificateByID,
    getCertificateByFarmID,
    getCertificatesByPlantID
}
