const primary_processing = require('../services/primary_processing'),
    users  = require('../services/users');

const get = async (req, res) => {
    cols = "hq,department,address,id_district,state, is_active,geo_lat,geo_long,id_file,id_report,id_report_aui,id_establishment,id_province,name,id,ruc,request_id,food_type,person_type";

    if (req.decoded){
        if (!req.decoded.id){
            res.status(400).send({
                message: 'ID is mandatory'
            });
            return
        }

        // if(!await checkStatus(req.decoded.id)){
        //     res.status(400).send({
        //         message: 'You are logged out'
        //     })
        //     return
        // }

        cols = "hq,department,address,id_district,state, is_active,geo_lat,geo_long,id_file,id_report,id_report_aui,id_establishment,id_province,id,veterinarian, dni_veterinarian,name,ruc,request_id,food_type,person_type";
    }

    data = await primary_processing.get(req.params.id, cols);

    if (!data){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (data.body.length == 0){
        res.status(200).send({
            message: 'No results',
            data: []
        })
        return
    }

    res.send({
        message: 'Results found',
        data: data.body.data
    });
    return
}

const checkStatus = async (id) => {
    status = await users.getOne(id, 'status');

    if (!status){
        return false
    }

    if (status != "1") {
        return false
    }

    return true
}

module.exports = {
    get,
}
