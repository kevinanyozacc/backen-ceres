const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSA',
      TABLE='AUTORIZACION_MATADERO',
      ATTR={
          CODI_CBEN_CBE:       ['CODI_CBEN_CBE'       , 'id'],
          CODIGO_AUTORIZACION: ['CODIGO_AUTORIZACION' , 'auth_id'],
          REPRESENTANTE:       ['REPRESENTANTE'       , 'contact_person'],
          DIRE_CBEN_CBE:       ['DIRE_CBEN_CBE'       , 'address_real'],
          FECH_CREA:           ['FECH_CREA'           , 'start_date'],
          FECHA_CIERRE:        ['FECHA_CIERRE'        , 'end_date'],
          RUC_CBEN_CBE:        ['RUC_CBEN_CBE'        , 'ruc'],
          ESTADO:              ['ESTADO'              , 'estado'],
          TELEFONO:            ['TELEFONO'            , 'mobile_phone'],
          TIPO_SOLICITUD:      ['TIPO_SOLICITUD'      , 'auth_type_short'],
          TIPO_AVE:            ['TIPO_AVE'            , 'bird_type'],
          TIPO_MATADERO:       ['TIPO_MATADERO'       , 'line_short'],
          TIPO_CBEN_CBE:       ['TIPO_CBEN_CBE'       , 'category_2_short'],
          CODI_SEDE_SED:       ['CODI_SEDE_SED'       , 'hq'],
          GEOGRAFICA_LATITUD:  ['GEOGRAFICA_LATITUD'  , 'geo_lat'],
          GEOGRAFICA_LONGITUD: ['GEOGRAFICA_LONGITUD' , 'geo_long'],
      };

const getAuth = async (id, cols) => {
    let result, result2, qry, qry2, db;
    const TABLE2='AUTORIZACION_MATADERO_ACTIVIDA';
    const TABLE3='ACTIVIDAD_MATADERO';

    qry  = `SELECT 'auth' AS "type", `;
    qry += `CASE WHEN ${TABLE}.${ATTR.TIPO_CBEN_CBE[0]} = 'P' THEN 'Privado' ELSE CASE WHEN ${TABLE}.${ATTR.TIPO_CBEN_CBE[0]} = 'M' THEN 'Municipal' ELSE 'No especificado' END END AS "category_2", `;
    qry += `CASE WHEN ${TABLE}.${ATTR.TIPO_MATADERO[0]} = 'M' THEN 'Matadero' ELSE CASE WHEN ${TABLE}.${ATTR.TIPO_MATADERO[0]} = 'F' THEN 'Frigorífico' ELSE CASE WHEN ${TABLE}.${ATTR.TIPO_MATADERO[0]} = 'P' THEN 'Centro de faenamiento' ELSE CASE WHEN ${TABLE}.${ATTR.TIPO_MATADERO[0]} = 'R' THEN 'Rendering' ELSE 'No especificado' END END END END AS "line", `;
    qry += `CASE WHEN ${TABLE}.${ATTR.TIPO_SOLICITUD[0]} = 'C' THEN 'Construcción' ELSE CASE WHEN ${TABLE}.${ATTR.TIPO_SOLICITUD[0]} = 'F' THEN 'Funcionamiento' ELSE 'No especificado' END END AS "auth_type", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE} `;
    qry += `WHERE ${TABLE}.${ATTR.CODI_CBEN_CBE[0]} =:id AND ${TABLE}.${ATTR.ESTADO[0]}='CIERRE JEFE AIAIA' AND ${TABLE}.${ATTR.CODI_SEDE_SED[0]} <> '1' AND ((${TABLE}.${ATTR.TIPO_MATADERO[0]}='P' AND ${TABLE}.${ATTR.TIPO_SOLICITUD[0]}='F') OR (${TABLE}.${ATTR.TIPO_MATADERO[0]}<>'P')) `;
    
    qry2  = `SELECT 'slaughterhouse-auth' AS "type", `;
    qry2 += `CODI_CBEN_CBE AS "id", `;
    qry2 += `${SCHEMA}.${TABLE3}.DESCRIPCION AS "activity" `;
    qry2 += `FROM  ${SCHEMA}.${TABLE} LEFT JOIN ${SCHEMA}.${TABLE2} ON ${SCHEMA}.${TABLE2}.CODIGO_AUTORIZACION=${SCHEMA}.${TABLE}.CODIGO_AUTORIZACION LEFT JOIN ${SCHEMA}.${TABLE3} ON ${SCHEMA}.${TABLE2}.CODIGO_ACTIVIDAD=${SCHEMA}.${TABLE3}.CODIGO_ACTIVIDAD `;
    qry2 += `WHERE ${TABLE}.${ATTR.CODI_CBEN_CBE[0]} =:id AND ${TABLE}.${ATTR.ESTADO[0]}='CIERRE JEFE AIAIA' AND ${TABLE}.${ATTR.CODI_SEDE_SED[0]} <> '1' AND ((${TABLE}.${ATTR.TIPO_MATADERO[0]}='P' AND ${TABLE}.${ATTR.TIPO_SOLICITUD[0]}='F') OR (${TABLE}.${ATTR.TIPO_MATADERO[0]}<>'P')) `;
    
    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        result2 = await db.execute(qry2, [ id ], { outFormat: 4002 });
        result.rows.map(v => v['activities'] = result2.rows.filter(v2 => v2['id'] === v['id']).map(v3 => v3['activity']));
    }catch(err){
        logger.error(err);
    } finally {
        if (db) {
          try {
            await db.close();  // always release the connection back to the pool
          } catch (err) {
            console.error(err);
          }
        }
      }

    return result;
}

module.exports = {
    getAuth,
    SCHEMA,
    TABLE,
    ATTR
}