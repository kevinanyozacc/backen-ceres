const search = require('../services/search'),
      users  = require('../services/users'),
      logger = require('../utils/logger');

const getStats = async (req, res) => {

    dataSvc = await search.getStats();

    if (!dataSvc){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (dataSvc.body.length == 0){
        res.status(200).send({
            message: 'No results',
            total: 0,
            data: []
        })
        return
    }

    res.send({
        message: 'Results found',
        total: dataSvc.body.data.length,
        data: dataSvc.body.data
    });
    return
}

const getCompany = async (req, res) => {
    cols  = "ubigeo,department,province,district,hq,name,ruc,dni,address_legal,address_real,location,geo_lat,geo_long,cent_lat,cent_long,year,start_date,end_date,document_code,id,tuition_code,ruc_professional,file_code,file_code_aui,estate_code,auth_code,vet_code,request_code,line,category,state,is_active,type,document_type,flag_dist_vet,flag_enva_vet,flag_expe_vet,flag_expo_vet,flag_fabr_ali,flag_fabr_alimed,flag_fabr_bio,flag_fabr_far,flag_fabr_vet,flag_impo_vet,flag_nuevo,fech_entr_cie,fech_expe_emp,fech_modi,fech_rece_sol,fech_regi_emp,fech_soli_emp,fech_vige_emp,nume_foli_emp,nume_foli_exp,nume_regi_his,nume_regi_tmp,obse_foli_exp,rdir_fech_emp,refe_dire_emp,regi_libr_emp,repr_lega_emp,tele_empr_emp,person_type,food_type,ubif_alma_emp,ubif_expe_emp,user_crea,user_modi,usua_vige_emp";
    where = "name,ruc,dni,id,file_code,auth_code,vet_code,request_code,nume_foli_emp,nume_foli_exp,nume_regi_his,nume_regi_tmp,regi_libr_emp,repr_lega_emp";

    if (!req.query.q){
        res.status(400).send({
            message: 'Q is mandatory'
        });
        return
    }

    dataSvc = await search.getCompany(cols, where, req.query.q, true);

    if (!dataSvc){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (dataSvc.body.length == 0){
        res.status(200).send({
            message: 'No results',
            total: 0,
            data: []
        })
        return
    }

    res.send({
        message: 'Results found',
        total: dataSvc.body.data.length,
        data: dataSvc.body.data
    });
    return
}

const getFarm = async (req, res) => {
    let cols = [
        "id",
        "hq",
        "department",
        "province",
        "district",
        "state",
        "name",
        "geo_lat",
        "geo_long",
        "start_date",
        "fech_modi",
        "year",
        "farmer_name",
        "farmer_dni",
        "farmer_ruc"
      ];
    let where = [
        "id",
        "name",
        "farmer_name",
        "farmer_dni",
        "farmer_ruc"
      ];

    if (!req.query.q){
        res.status(400).send({
            message: 'Q is mandatory'
        });
        return
    }

    dataSvc = await search.getFarm(cols, where, req.query.q);

    if (!dataSvc){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (dataSvc.body.length == 0){
        res.status(200).send({
            message: 'No results',
            total: 0,
            data: []
        })
        return
    }

    res.send({
        message: 'Results found',
        total: dataSvc.body.data.length,
        data: dataSvc.body.data
    });
    return
}

const getAnimal = async (req, res) => {
    cols = "codi_pred_pre,codi_sede_sed,nomb_pred_pre,codi_depa_pro,codi_prov_pro,codi_dist_pro,user_crea,fech_crea,user_modi,fech_modi,ididen,secuencial,secuencial_arete,cod_arete,gender,age,high_low,animal_specie,direccion,latid_dec_pre,long_dec_pre,codi_empl_per,nomb_prod_pro,dire_prod_pro,ruc_prod_pro,type";
    
    if (!req.query.q){
        res.status(400).send({
            message: 'Q is mandatory'
        });
        return
    }

    /*regPattern = new RegExp('^[A-Z].*$', 'i');
    where = 'codi_pred_pre';
    endpoint = '/predio-padron';

    if (regPattern.test(req.query.q)){
        where = 'cod_arete';
        endpoint = '/san-indet-animal-detalle';
    }*/
    where = 'cod_arete';
    endpoint = '/san-indet-animal-detalle';

    dataSvc = await search.getAnimal(endpoint, cols, where, req.query.q, true);

    if (!dataSvc){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (dataSvc.body.length == 0){
        res.status(200).send({
            message: 'No results',
            total: 0,
            data: []
        })
        return
    }

    res.send({
        message: 'Results found',
        total: dataSvc.body.data.length,
        data: dataSvc.body.data
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
    getStats,
    getCompany,
    getFarm,
    getAnimal
}
