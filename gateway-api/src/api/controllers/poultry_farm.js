const poultry_farm = require('../services/poultry_farm'),
      users  = require('../services/users');

const get = async (req, res) => {
    cols = "file_code,capacidad_diaria,capacidad_instalada,apellido_materno_solicitante,apellido_paterno_solicitante,ccodexp,correo_establecimiento,domicilio_legal_interesado,email_interesado,is_active,fax_interesado,nombres_solicitante,dni,file_code,estate_code,department,district,province,hq,name,cref_direcc_establecimiento,ruc,year,solicitud_construccion,telefono_establecimiento,telefono_interesado,address_legal,start_date,end_date,state,fecha_vencimiento_autorizacion,tipo_establecimiento,geo_lat,geo_long,giro_granja,autorizacion_funcionamiento,nombre_establecimiento,numero_galpones,numero_informe,numero_registro,persona_contactar,tipos_ave,tipo_documento_interesado";

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

        cols = "file_code,capacidad_diaria,capacidad_instalada,apellido_materno_solicitante,apellido_paterno_solicitante,ccodexp,correo_establecimiento,domicilio_legal_interesado,email_interesado,is_active,fax_interesado,nombres_solicitante,dni,file_code,estate_code,department,district,province,hq,name,cref_direcc_establecimiento,ruc,year,solicitud_construccion,telefono_establecimiento,telefono_interesado,address_legal,start_date,end_date,state,fecha_vencimiento_autorizacion,tipo_establecimiento,geo_lat,geo_long,giro_granja,autorizacion_funcionamiento,nombre_establecimiento,numero_galpones,numero_informe,numero_registro,persona_contactar,tipos_ave,tipo_documento_interesado";
    }

    data = await poultry_farm.get(req.params.id, cols);

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
