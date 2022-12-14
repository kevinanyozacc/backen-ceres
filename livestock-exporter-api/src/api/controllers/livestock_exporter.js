const livestock_exporter  = require('../models/livestock_exporter');

const getByID = async (req, res) => {
    if (!req.params.id || !req.query.cols){
        res.status(400).json({
            message: 'ID is mandatory',
            data: []
        });
        return
    }

    result = await livestock_exporter.getByID(req.params.id, JSON.parse(req.query.cols));

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
    getByID
}
