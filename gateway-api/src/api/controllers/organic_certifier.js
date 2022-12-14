const ocpo = require('../services/organic_certifier'),
      users  = require('../services/users');

const get = async (req, res) => {
    cols = [
        "id",
        "type",
        "certifier_id",
        "document_code",
        "user_code",
        "name",
        "ruc",
        "address_real",
        "contact_person",
        "contact_person_position",
        "creditor_name",
        "creditor_phone",
        "creditor_address",
        "creditor_email",
        "licence_by",
        "certify_wild",
        "certify_vegetal_production",
        "certify_animal_production",
        "certify_comerce",
        "certify_apiculture",
        "certify_process",
        "start_date",
        "end_date",
        "fech_modi",
        "department",
        "province",
        "district",
        "email",
        "year",
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
            "contact_person_dni",
            "contact_person_phone",
            "contact_person_email");
    }

    data = await ocpo.get(req.params.id, cols);

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
