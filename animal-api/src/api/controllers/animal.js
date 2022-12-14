const animal = require('../models/animal');
const events = require('../models/events');

const getByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    let result = await animal.getByID(req.params.id, JSON.parse(req.query.cols));

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

const getByEarringID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    if (req.params.id.length < 7 && /^\d+$/.test(req.params.id)) {
        res.status(400).send({
            message: 'Earring id is not valid'
        });
        return
    }

    let result = await animal.getByEarringID(req.params.id, JSON.parse(req.query.cols));

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

const getEventsByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    let result = await events.getEventsByID(req.params.id, JSON.parse(req.query.cols));

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

const getByFarmID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    let result = await animal.getByFarmID(req.params.id, JSON.parse(req.query.cols));

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

const saveEvent = async (req, res) => {
    if (!req.body.earring_id ||
        !req.body.lat ||
        !req.body.long 
        ){
        res.status(400).json({
            message: 'Earring id, lat and long are mandatory',
            user: []
        });
        return
    }

    let r = await events.insert(req.body);

    if (!r){
        res.status(500).json({
            message: 'Database error'
        })
        return
    }

    res.json({
        message: 'Event created successfully'
    });
}

module.exports = {
    getByID,
    getByEarringID,
    getEventsByID,
    getByFarmID,
    saveEvent
}
