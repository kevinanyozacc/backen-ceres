const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSA',
      TABLE='SANITARIO_FUNCIONAMIENTO',
      ATTR={
          CSOLICITUD_FUNCIONAMIENTO:     ['CSOLICITUD_FUNCIONAMIENTO'    , 'id'],
          CAPACIDAD_DIARIA:              ['CAPACIDAD_DIARIA'             , 'capacidad_diaria'],
          CAPACIDAD_INSTALADA:           ['CAPACIDAD_INSTALADA'          , 'capacidad_instalada'],
          CAPELLIDO_MATERNO_SOLICITANTE: ['CAPELLIDO_MATERNO_SOLICITANTE', 'apellido_materno_solicitante'],
          CAPELLIDO_PATERNO_SOLICITANTE: ['CAPELLIDO_PATERNO_SOLICITANTE', 'apellido_paterno_solicitante'],
          CCODEXP:                       ['CCODEXP'                      , 'ccodexp'],
          CCORREO_ESTABLECIMIENTO:       ['CCORREO_ESTABLECIMIENTO'      , 'correo_establecimiento'],
          CDOMICILIO_LEGAL_INTERESADO:   ['CDOMICILIO_LEGAL_INTERESADO'  , 'domicilio_legal_interesado'],
          CEMAIL_INTERESADO:             ['CEMAIL_INTERESADO'            , 'email_interesado'],
          CESTADO_SOLICITUD:             ['CESTADO_SOLICITUD'            , 'is_active'],
          CFAX_INTERESADO:               ['CFAX_INTERESADO'              , 'fax_interesado'],
          CNOMBRES_SOLICITANTE:          ['CNOMBRES_SOLICITANTE'         , 'nombres_solicitante'],
          CNUMERO_DOCUMENTO_INTERESADO:  ['CNUMERO_DOCUMENTO_INTERESADO' , 'dni'],
          CNUME_EXPE_EXP:                ['CNUME_EXPE_EXP'               , 'file_code'],
          CODIGO_PREDIO:                 ['CODIGO_PREDIO'                , 'estate_code'],
          CODI_DEPA_DPT_ESTABLECIMIENTO: ['CODI_DEPA_DPT_ESTABLECIMIENTO', 'department'],
          CODI_DIST_TDI_ESTABLECIMIENTO: ['CODI_DIST_TDI_ESTABLECIMIENTO', 'district'],
          CODI_PROV_TPR_ESTABLECIMIENTO: ['CODI_PROV_TPR_ESTABLECIMIENTO', 'province'],
          CODI_SEDE_SED:                 ['CODI_SEDE_SED'                , 'hq'],
          CRAZON_SOCIAL_SOLICITANTE:     ['CRAZON_SOCIAL_SOLICITANTE'    , 'name'],
          CREFERENCIA_DIR_ESTABLEC:      ['CREFERENCIA_DIR_ESTABLEC'     , 'creferencia_dir_establec'],
          CRUC_INTERESADO:               ['CRUC_INTERESADO'              , 'ruc'],
          CSOLICITUD_ANNO:               ['CSOLICITUD_ANNO'              , 'year'],
          CSOLICITUD_CONSTRUCCION:       ['CSOLICITUD_CONSTRUCCION'      , 'solicitud_construccion'],
          CTELEFONO_ESTABLECIMIENTO:     ['CTELEFONO_ESTABLECIMIENTO'    , 'telefono_establecimiento'],
          CTELEFONO_INTERESADO:          ['CTELEFONO_INTERESADO'         , 'telefono_interesado'],
          DIRECCION_ESTABLECIMIENTO:     ['DIRECCION_ESTABLECIMIENTO'    , 'address_legal'],
          DSOLICITUD_FECHA:              ['DSOLICITUD_FECHA'             , 'start_date'],
          DFECHA_ESPECIALISTA_CIERRE:    ['DFECHA_ESPECIALISTA_CIERRE'   , 'end_date'],
          FAVORABLE:                     ['FAVORABLE'                    , 'state'],
          FECHA_VENCE_AUTORIZACION:      ['FECHA_VENCE_AUTORIZACION'     , 'fecha_vencimiento_autorizacion'],
          FTIPO_ESTABLECIMIENTO:         ['FTIPO_ESTABLECIMIENTO'        , 'tipo_establecimiento'],
          GEOGRAFICA_LATITUD:            ['GEOGRAFICA_LATITUD'           , 'geo_lat'],
          GEOGRAFICA_LONGITUD:           ['GEOGRAFICA_LONGITUD'          , 'geo_long'],
          GIRO_GRANJA:                   ['GIRO_GRANJA'                  , 'giro_granja'],
          NAUTORIZACION_FUNCIONAMIENTO:  ['NAUTORIZACION_FUNCIONAMIENTO' , 'autorizacion_funcionamiento'],
          NOMBRE_ESTABLECIMIENTO:        ['NOMBRE_ESTABLECIMIENTO'       , 'nombre_establecimiento'],
          NUMERO_GALPONES:               ['NUMERO_GALPONES'              , 'numero_galpones'],
          NUMERO_INFORME:                ['NUMERO_INFORME'               , 'numero_informe'],
          NUMERO_REGISTRO:               ['NUMERO_REGISTRO'              , 'numero_registro'],
          PERSONA_CONTACTAR:             ['PERSONA_CONTACTAR'            , 'persona_contactar'],
          TIPOS_AVE:                     ['TIPOS_AVE'                    , 'tipos_ave'],
          TIPO_DOCU_IDE_INTERESADO:      ['TIPO_DOCU_IDE_INTERESADO'     , 'tipo_documento_interesado'],
      };

const getByID = async (id, cols) => {
    let result;

    qry  = `SELECT 'poultry-farm' AS "type", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}\nWHERE ${TABLE}.${ATTR.CSOLICITUD_FUNCIONAMIENTO[0]}=:id`;

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        await db.close();
    }catch(err){
        logger.error(err);
    }

    return result;
}

module.exports = {
    getByID,
    SCHEMA,
    TABLE,
    ATTR
}
