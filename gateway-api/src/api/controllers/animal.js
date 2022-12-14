const animals = require('../services/animal'),
      users  = require('../services/users');


const get = async (req, res) => {
    let cols = [
        "ididen",
        "secuencial",
        "secuencial_arete",
        "cod_arete",
        "gender",
        "age",
        "high_low",
        "animal_specie",
        "codi_sede_sed",
        "codi_empl_per",
        "nomb_prod_pro",
        "dire_prod_pro",
        "ruc_prod_pro",
        "codi_pred_pre",
        "nomb_pred_pre",
        "codi_depa_pro",
        "codi_prov_pro",
        "codi_dist_pro",
        "tele_prop_pre",
        "celu_prop_pre",
        "email_prop_pre",
        "direccion",
        "latid_dec_pre",
        "long_dec_pre",
        "tele_prop_pre",
        "celu_prop_pre",
        "fech_crea"
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

    }

    const data = await animals.get(req.params.id, cols);

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


const getEvents = async (req, res) => {
    let cols = [
        "type",
        "start_date",
        "user_id",
        "user_name",
        "company_type",
        "company_id",
        "department_origin",
        "province_origin",
        "district_origin",
        "hq",
        "geo_lat",
        "geo_long",
        "comment",
        "company_type_destination",
        "company_id_destination",
        "department_destination",
        "province_destination",
        "district_destination",
      ];



    if (!req.params.id){
        res.status(400).send({
            message: 'ID is mandatory'
        });
        return
    }

    const data = await animals.getEvents(req.params.id, cols);

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

const getByFarmID = async (req, res) => {
    let cols = [
        "ididen",
        "secuencial",
        "secuencial_arete",
        "cod_arete",
        "gender",
        "age",
        "high_low",
        "animal_specie",
        "fech_modi"
    ];

    const data = await animals.getByFarmID(req.params.id, cols);

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
        data: data.body.data,
        total: data.body.data.length
    });
    return
}


const getAnimalByEarring = async (req, res) => {
    let cols = [
        "ididen",
        "secuencial",
        "secuencial_arete",
        "cod_arete",
        "gender",
        "age",
        "high_low",
        "high_low",
        "animal_specie",
        "codi_sede_sed",
        "codi_empl_per",
        "nomb_prod_pro",
        "dire_prod_pro",
        "ruc_prod_pro",
        "codi_pred_pre",
        "nomb_pred_pre",
        "codi_depa_pro",
        "codi_prov_pro",
        "codi_dist_pro",
        "tele_prop_pre",
        "celu_prop_pre",
        "email_prop_pre",
        "direccion",
        "latid_dec_pre",
        "long_dec_pre",
        "tele_prop_pre",
        "celu_prop_pre",
        "fech_crea"
    ];
    if (!req.params.id){
        res.status(400).json({
            message: 'Earring id is mandatory'
        });
        return
    }

    if (req.params.id.length < 7 && /^\d+$/.test(req.params.id)) {
        res.status(400).send({
            message: 'Earring id is not valid'
        });
        return
    }

    const data = await animals.getByEarringID(req.params.id, cols);

    if (!data){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (data.body.length == 0){
        res.status(404).send({
            message: 'Earring not found'
        })
        return
    }

    if (data.body.data.length > 1){
        res.status(404).send({
            message: 'Earring ID is not unique. Contact SENASA for more information'
        })
        return
    }

    res.send({
        message: `Results found`,
        total: data.body.data.length,
        animal: data.body.data
    })
    return
}

const saveEvent = async (req, res) => {
    if (!req.body.earring_id){
        res.status(400).json({
            message: 'Earring id is mandatory'
        });
        return
    }

    if (req.body.earring_id.length < 12) {
        res.status(400).send({
            message: 'Earring id is not valid'
        });
        return
    }

    if (!req.body.lat || !req.body.long){
        res.status(400).json({
            message: 'Lat and long are mandatory'
        });
        return
    }

    const data = await animals.saveEvent(req.body);


    if (!data) {
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    res.send({
        message: `Added event to animal with earring ${req.body.earring_id}`,
    })
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
    getAnimalByEarring,
    getEvents,
    getByFarmID,
    saveEvent
}