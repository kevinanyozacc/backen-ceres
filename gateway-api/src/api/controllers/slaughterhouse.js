const slaughterhouse = require('../services/slaughterhouse'),
      users  = require('../services/users');

const get = async (req, res) => {
    let cols = [
        "type",
        "id",
        "name",
        "contact_person",
        "ruc",
        "department",
        "province",
        "district",
        "location",
        "hq",
        "address_real",
        "line",
        "category",
        "category_2",
        "year",
        "start_date",
        "end_date",
        "fech_modi",
        "geo_lat",
        "geo_long"
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
            "dni",
            "phone",
            "vet_code",
            "name_medi_vet"
            );
    }

    const data = await slaughterhouse.get(req.params.id, cols);

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

const getAuth = async (req, res) => {
    let cols = [
        "id",
        "auth_type",
        "auth_id",
        "address_real",
        "contact_person",
        "ruc",
        "start_date",
        "end_date",
        "mobile_phone",
        "line",
        "category_2",
        "bird_type",
        "geo_lat",
        "geo_long",
        "hq"
      ];

    const data = await slaughterhouse.getAuth(req.params.id, cols);

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
        total: data.body.data.length,
        data: data.body.data
    });
    return
}

const getCSTI = async (req, res) => {
    let cols = [
        "id",
        "csti_id",
        "type",
        "valid_days",
        "start_date",
        "valid_start_date",
        "contact_person",
        "department_origin",
        "province_origin",
        "district_origin",
        "file_code",
        "contact_person_type",
        "contact_person_dni",
        "farm"
      ];

    const data = await slaughterhouse.getCSTI(req.params.id, cols);

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
        total: data.body.data.length,
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
    getAuth,
    getCSTI
}
