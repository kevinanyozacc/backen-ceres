const farm = require('../services/farm'),
    users  = require('../services/users');


const get = async (req, res) => {
    let cols = [
        "id",
        "name",
        "hq",
        "department",
        "province",
        "district",
        "state",
        "address_real",
        "geo_lat",
        "geo_long",
        "start_date",
        "fech_modi",
        "year",
        "area",
        "farmer_id",
        "reg_farm_id",
        "farm_bpp",
        "farm_bpa",
        "farmer_state",
        "farmer_name",
        "farmer_type",
        "farmer_dni",
        "farmer_company_name",
        "farmer_ruc"
      ];
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

        cols.push(
            "farmer_address",
            "farmer_phone",
            "farmer_email",
            );

    }

    const data = await farm.get(req.params.id, cols);

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


const getECAS = async (req, res) => {
    let cols = [
        "school_id",
        "plague_id"
      ];

    const data = await farm.getECAS(req.params.id, cols);

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
    getECAS
}