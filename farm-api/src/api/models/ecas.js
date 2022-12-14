const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');


const SCHEMA='SIGIA',
      TABLE='PF_ESCUELA_CAMPO_PREDIOS',
      ATTR={
        ESCUELA_ID:             ['ESCUELA_ID'             , 'school_id'],
        EVALUACION_PLAGA_ID:    ['EVALUACION_PLAGA_ID'    , 'plague_id'],
        REGISTRO_ID:    				['REGISTRO_ID'    				, 'record_id'],
        SECUENCIAL_PRE:    			['SECUENCIAL_PRE'    			, 'sequential_pre'],
      };

const getByFarmID = async (id, cols) => {
    let result, qry, db;
    let result2, qry2;

    qry  = `SELECT `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM ${SCHEMA}.${TABLE} `;
    qry += `WHERE ${TABLE}.CODI_SEDE_SED || ${TABLE}.CODI_PROD_MOS || ${TABLE}.CODI_PRED_MOS =UPPER(:id)`;

    console.log(qry);

		qry2  = `SELECT ACT.DESCRIPCION_QUE AS "activity", ACT.FECHA AS "activity_date", `;
    qry2 += await utils.makeSelect(cols, TABLE, ATTR);
    qry2 += `FROM ${SCHEMA}.${TABLE} LEFT JOIN PF_ESCUELA_CAMPO_PREDIOS_ACTIV ACT ON ACT.REGISTRO_ID= ${TABLE}.REGISTRO_ID AND  ACT.SECUENCIAL_PRE= ${TABLE}.SECUENCIAL_PRE `;
    qry2 += `WHERE ${TABLE}.CODI_SEDE_SED || ${TABLE}.CODI_PROD_MOS || ${TABLE}.CODI_PRED_MOS =UPPER(:id)`;


    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        result2 = await db.execute(qry2, [ id ], { outFormat: 4002 });
				result.rows.map(v => v['activities'] = result2.rows.filter(v2 => v2['record_id'] === v['record_id'] && v2['sequential_pre'] === v['sequential_pre']).map(a => a['activity']));
    } catch(err){
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
    getByID: getByFarmID,
    SCHEMA,
    TABLE,
    ATTR
}
