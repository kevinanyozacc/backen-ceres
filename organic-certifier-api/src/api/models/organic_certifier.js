const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SICPO',
      TABLE='PO_CERTIFICADOR_REGISTRO',
      ATTR={
        REGISTRO_ID:                ['REGISTRO_ID', 'id', 1],
        SOLICITUD_ID:               ['SOLICITUD_ID', 'solicitud_id', 1],
        CERTIFICADOR_ID:            ['CERTIFICADOR_ID', 'certifier_id', 1],
        ESTADO:                     ['ESTADO', 'state', 0],
        NRO_REGISTRO:               ['NRO_REGISTRO', 'document_code', 1],
        REPRESENTANTE_ID:           ['REPRESENTANTE_ID', "user_code", 1],
        REPRESENTANTE_CARGO:        ['REPRESENTANTE_CARGO', 'contact_person_position', 1],
        ACREDITADOR_RAZON_SOCIAL:   ['ACREDITADOR_RAZON_SOCIAL', 'creditor_name', 1],
        ACREDITADOR_TELEFONO:       ['ACREDITADOR_TELEFONO', 'creditor_phone', 1],
        ACREDITADOR_DIRECCION:      ['ACREDITADOR_DIRECCION', 'creditor_address', 1],
        ACREDITADOR_EMAIL:          ['ACREDITADOR_EMAIL', 'creditor_email', 1],
        LICENCE_BY:                 ['LICENCIA_OTORGADA', 'licence_by', 1],
        SOLICITA_SILVESTRE:         ['SOLICITA_SILVESTRE', 'certify_wild', 1],
        SOLICITA_PRODUCCION_VEGETAL:['SOLICITA_PRODUCCION_VEGETAL', 'certify_vegetal_production', 1],
        SOLICITA_PRODUCCION_ANIMAL: ['SOLICITA_PRODUCCION_ANIMAL', 'certify_animal_production', 1],
        SOLICITA_COMERCIALIZACION:  ['SOLICITA_COMERCIALIZACION', 'certify_comerce', 1],
        SOLICIATA_APICULTURA:       ['SOLICITA_APICULTURA', 'certify_apiculture', 1],
        SOLICIATA_PROCESAMIENTO:    ['SOLICIATA_PROCESAMIENTO', 'certify_process', 1],
      },
      TABLE_SOL='PO_CERTIFICADOR_SOLICITUD',
      ATTR_SOL={
        SOLICITUD_ID:               ['SOLICITUD_ID', 'solicitud_id', 0],
        START_DATE:                 ['FECHA_REGISTRO', 'start_date', 1],
        END_DATE:                   ['FECHA_CIERRE_DIRECTOR', 'end_date', 1],
        FECHA_MODIFICACION:         ['FECHA_MODIFICACION', 'fech_modi', 1],
        CERTIFICADOR_RUC:           ['CERTIFICADOR_RUC', 'ruc', 1],
        CERTIFICADOR_RAZON_SOCIAL:  ['CERTIFICADOR_RAZON_SOCIAL', 'name', 1],
        CERTIFICADOR_DIRECCION:     ['CERTIFICADOR_DIRECCION', 'address_real', 1],
        CERTIFICADOR_DEPARTAMENTO:  ['CERTIFICADOR_DEPARTAMENTO', 'department', 1],
        CERTIFICADOR_PROVINCIA:     ['CERTIFICADOR_PROVINCIA','province', 1],
        CERTIFICADOR_DISTRITO:      ['CERTIFICADOR_DISTRITO', 'district', 1],
        CERTIFICADOR_EMAIL:         ['CERTIFICADOR_EMAIL', 'email', 1],
        REPRESENTANTE_NOMBRE:       ['REPRESENTANTE_NOMBRE', 'contact_person_name', 0],
        REPRESENTANTE_PATERNO:      ['REPRESANTANTE_PATERNO', 'contact_person_lastname_1', 0],
        REPRESENTANTE_MATERNO:      ['REPRESENTANTE_MATERNO', 'contact_person_lastname_2', 0],
        REPRESENTANTE_CARGO:        ['REPRESENTANTE_CARGO', 'contact_person_position', 1],
        REPRESENTANTE_NUMERO_DOC:   ['REPRESENTANTE_NUMERO_DOC', 'contact_person_dni', 0],
        REPRESENTANTE_TELEFONO:     ['REPRESENTANTE_TELEFONO', 'contact_person_phone', 1],
        REPRESENTANTE_EMAIL:        ['REPRESENTANTE_EMAIL', 'contact_person_email', 1],
        REPRESENTANTE_TIPO_DOC:     ['REPRESENTANTE_TIPO_DOC', 'contact_person_tipo_doc', 0],
      };

const getByID = async (id, cols) => {
    let result;

    qry  = `SELECT 'organic-certifier' AS "type",\n`;
    qry += `CASE WHEN ${TABLE}.${ATTR.ESTADO[0]} = 'REGISTRADO' THEN '1' ELSE '0' END AS "is_active",\n`;
    qry += `CAST(EXTRACT(YEAR FROM ${TABLE_SOL}.${ATTR_SOL.END_DATE[0]}) AS CHAR(4)) AS "year",\n`;
    qry += `${TABLE_SOL}.${ATTR_SOL.REPRESENTANTE_NOMBRE[0]} || ' ' || ${TABLE_SOL}.${ATTR_SOL.REPRESENTANTE_PATERNO[0]} || ' ' || ${TABLE_SOL}.${ATTR_SOL.REPRESENTANTE_MATERNO[0]} AS "contact_person",\n`;
    qry += `CASE WHEN  ${TABLE_SOL}.${ATTR_SOL.REPRESENTANTE_TIPO_DOC[0]}= '01' THEN ${TABLE_SOL}.${ATTR_SOL.REPRESENTANTE_NUMERO_DOC[0]} ELSE NULL END AS "contact_person_dni",\n`;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += ',\n';
    qry += await utils.makeSelect(cols, TABLE_SOL, ATTR_SOL);
    qry += `FROM  ${SCHEMA}.${TABLE} LEFT JOIN ${SCHEMA}.${TABLE_SOL} ON ${TABLE}.${ATTR.SOLICITUD_ID[0]}=${TABLE_SOL}.${ATTR_SOL.SOLICITUD_ID[0]}\n`;
    qry += `WHERE ${TABLE}.${ATTR.REGISTRO_ID[0]}=:id`;
    
    console.log(qry);

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
