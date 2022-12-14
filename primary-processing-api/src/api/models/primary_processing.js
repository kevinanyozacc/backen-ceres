const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSVE',
      TABLE='EAS_REGISTRO_SANITARIO',
      ATTR={
          CSEDE_SOLICITANTE: ['CSEDE_SOLICITANTE', 'hq'],
          DEPARTAMENTO_ID: ['DEPARTAMENTO_ID', 'department'],
          DIRECCION_ESTABLECIMIENTO: ['DIRECCION_ESTABLECIMIENTO', 'address'],
          DISTRITO_ID: ['DISTRITO_ID', 'id_district'],
          LATITUD: ['LATITUD', 'geo_lat'],
          LONGITUD: ['LONGITUD', 'geo_long'],
          NRO_EXPEDIENTE_SAU: ['NRO_EXPEDIENTE_SAU', 'id_file'],
          NRO_INFORME: ['NRO_INFORME', 'id_report'],
          NRO_INFORME_AUI: ['NRO_INFORME_AUI', 'id_report_aui'],
          NRO_REGISTRO_ESTABLECIMIENTO: ['NRO_REGISTRO_ESTABLECIMIENTO', 'id_establishment'],
          PROVINCIA_ID: ['PROVINCIA_ID', 'id_province'],
          PR_NRO_COLEGIATURA: ['PR_NRO_COLEGIATURA', 'veterinarian'],
          PR_NRO_DOCUMENTO: ['PR_NRO_DOCUMENTO', 'dni_veterinarian'],
          RAZON_SOCIAL: ['RAZON_SOCIAL', 'name'],
          REGISTRO_ID: ['REGISTRO_ID', 'id'],
          RUC: ['RUC', 'ruc'],
          SOLICITUD_ID: ['SOLICITUD_ID', 'request_id'],
          TIPO_ALIMENTO: ['TIPO_ALIMENTO', 'food_type'],
          TIPO_PERSONA: ['TIPO_PERSONA', 'person_type'],
      };

const getByID = async (id, cols) => {
    let result;

    qry  = `SELECT 'primary-processing' AS "type", `;
    qry += `EAS_REGISTRO_SANITARIO.ESTADO AS "state", CASE WHEN (EAS_REGISTRO_CAMBIO_ESTADO.ESTADO_CAMBIO = 'AUTORIZADO' OR EAS_REGISTRO_CAMBIO_ESTADO.ESTADO_CAMBIO  IS NULL) AND EAS_REGISTRO_SANITARIO.ESTADO = 'AUTORIZADO' AND EAS_REGISTRO_SANITARIO.CSEDE_SOLICITANTE <> '1' THEN '1' ELSE '0' END AS "is_active", `
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}`
    qry += ` LEFT JOIN (
                SELECT A.*
                FROM SIGSVE.EAS_REGISTRO_CAMBIO_ESTADO A
                INNER JOIN (
                    SELECT REGISTRO_ID,  MAX(SECUENCIAL_ID) SECUENCIAL
                    FROM SIGSVE.EAS_REGISTRO_CAMBIO_ESTADO
                    GROUP BY REGISTRO_ID
                ) B ON (B.REGISTRO_ID = A.REGISTRO_ID) AND (B.SECUENCIAL = A.SECUENCIAL_ID)
              ) EAS_REGISTRO_CAMBIO_ESTADO ON EAS_REGISTRO_CAMBIO_ESTADO.REGISTRO_ID = EAS_REGISTRO_SANITARIO.REGISTRO_ID`
    qry += ` WHERE ${TABLE}.${ATTR.REGISTRO_ID[0]}=:id`;

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
