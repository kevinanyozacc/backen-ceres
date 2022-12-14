const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGIA',
      TABLE='PIE_SOL_SANITARIO_DATOS',
      ATTR={
          SOLICITUD_ID:              ['SOLICITUD_ID'             , 'id'],
          RAZON_SOCIAL:              ['RAZON_SOCIAL'             , 'name'],
          RUC:                       ['RUC'                      , 'ruc'],
          DIRECCION_ESTABLECIMIENTO: ['DIRECCION_ESTABLECIMIENTO', 'address_legal'],
          DEPARTAMENTO_ID:           ['DEPARTAMENTO_ID'          , 'department'],
          PROVINCIA_ID:              ['PROVINCIA_ID'             , 'province'],
          DISTRITO_ID:               ['DISTRITO_ID'              , 'district'],
          RUC_PROFESIONAL:           ['RUC_PROFESIONAL'          , 'ruc_profesional'],
          PR_NRO_COLEGIATURA:        ['PR_NRO_COLEGIATURA'       , 'tuition_code'],
          ESTABLECIMIENTO_DIRECCION: ['ESTABLECIMIENTO_DIRECCION', 'address_real'],
      };

const getByID = async (id, cols) => {
    let result;

    qry  = `SELECT 'feed-processing' AS "type", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}\nWHERE ${TABLE}.${ATTR.SOLICITUD_ID[0]}=:id`;

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
