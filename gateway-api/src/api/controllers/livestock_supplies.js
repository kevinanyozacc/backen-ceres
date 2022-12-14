const livestock_supplies = require('../services/livestock_supplies'),
      users  = require('../services/users');

const get = async (req, res) => {
    cols = "year,department,province,district,hq,address_legal,address_real,flag_dist_vet,flag_enva_vet,flag_expe_vet,flag_expo_vet,flag_fabr_ali,flag_fabr_alimed,flag_fabr_bio,flag_fabr_far,flag_fabr_vet,flag_impo_vet,document_code,name,id,ruc,document_type";

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

        cols = "year,ccodcli,department,province,district,hq,address_legal,address_real,emai_empr_vet,is_active,fax_empr_vet,fech_crea,fech_modi,start_date,end_date,feex_dist_vet,feve_dist_vet,flag_dist_vet,flag_enva_vet,flag_expe_vet,flag_expo_vet,flag_fabr_ali,flag_fabr_alimed,flag_fabr_bio,flag_fabr_far,flag_fabr_vet,flag_impo_vet,lice_func_mun,document_code,name,id,regi_prof_ppr,regi_soli_est,ruc";
    }

    data = await livestock_supplies.get(req.params.id, cols);

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