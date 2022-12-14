const agricultural_supplies = require('../services/agricultural_supplies'),
      users  = require('../services/users');

const get = async (req, res) => {
    cols = "name,year,department,province,district,hq,address_legal,start_date,end_date,line,ruc,file_code,request_code,id,category";

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

        cols = "name,year,department,province,district,hq,address_legal,start_date,end_date,line,ruc,file_code,request_code,id,repr_lega_emp,tele_empr_emp,email_empr_emp,category";
    }

    data = await agricultural_supplies.get(req.params.id, cols);

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
