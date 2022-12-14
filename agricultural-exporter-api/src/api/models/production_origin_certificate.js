const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA = "FINALBPM",
      TABLE = "BPM_EXP_CERTIFICADO_LUGAR",
      ATTR = {
        CODI_CERT_LUG: ["CODI_CERT_LUG", "certificate_id"],
        CODI_SOLI_LUG: ["CODI_SOLI_LUG", "application_id"],
        NUME_CAMP_EXP: ["NUME_CAMP_EXP", "camp_exportacion"],
        CODI_SEDE_SED: 		["CODI_SEDE_SED", "hq"],
        CODI_PROD_MOS: 		["CODI_PROD_MOS", "codi_prod_mos"],
        CODI_PRED_MOS: 		["CODI_PRED_MOS", "codi_pred_mos"],
        AREA_CERT: 		    ["AREA_CERT", "area"],
        FECH_INI_ACT: 		["FECH_INI_ACT", "start_date"]
      };

const TABLE_PROD = "BPM_EXP_SOLICITUD_LUGAR_ESP",
      ATTR_PROD = {
        CODI_SOLI_LUG: ["CODI_SOLI_LUG", "application_id"],
        PERIODO_COS_FIN: ["PERIODO_COS_FIN", "start_harvest"],
        CODIGO_PRODUCTO: ["CODIGO_PRODUCTO", "product_id"],
        CODI_HOSP_MOS: ["CODI_HOSP_MOS", "codi_hosp_mos"],
      };

const getCertificates = async (farm_id, cols) => {
    let result, result2, qry, qry2, db;
    
    qry  = `SELECT 'production-origin-certificate' AS "type", `; 
    qry  += `CONCAT(CONCAT(${TABLE}.${ATTR.CODI_SEDE_SED[0]}, ${TABLE}.${ATTR.CODI_PROD_MOS[0]}), ${TABLE}.${ATTR.CODI_PRED_MOS[0]}) AS "farm_id", `; 
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM ${SCHEMA}.${TABLE} `; 
    qry += `WHERE 
    CONCAT(CONCAT(${TABLE}.${ATTR.CODI_SEDE_SED[0]}, ${TABLE}.${ATTR.CODI_PROD_MOS[0]}), ${TABLE}.${ATTR.CODI_PRED_MOS[0]}) =:farm_id AND ${TABLE}.${ATTR.FECH_INI_ACT[0]} >= (TRUNC(SYSDATE) - 728) `;

		qry2 = `SELECT 
			producto.CODIGO_PARTIDA_ARANCELARIA as "export_code", 
			producto.NOMBRE_COMERCIAL_PRODUCTO as "name",
			producto.NOMBRE_CIENTIFICO_PRODUCTO AS "scientific_name", `
    qry2 += await utils.makeSelect(cols, TABLE_PROD, ATTR_PROD);
		qry2 += `	
		FROM  ${SCHEMA}.${TABLE} 
		LEFT JOIN ${SCHEMA}.${TABLE_PROD} ON ${TABLE}.${ATTR.CODI_SOLI_LUG[0]}= ${TABLE_PROD}.${ATTR_PROD.CODI_SOLI_LUG[0]}  
		LEFT JOIN Finalbpm.producto ON ${TABLE_PROD}.${ATTR_PROD.CODIGO_PRODUCTO[0]} =producto.CODIGO_PRODUCTO  
		`;
		qry2 += `WHERE 
    CONCAT(CONCAT(${TABLE}.${ATTR.CODI_SEDE_SED[0]}, ${TABLE}.${ATTR.CODI_PROD_MOS[0]}), ${TABLE}.${ATTR.CODI_PRED_MOS[0]}) =:farm_id AND ${TABLE}.${ATTR.FECH_INI_ACT[0]} >= (TRUNC(SYSDATE) - 728) `;
    console.log(qry2)

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ farm_id ], { outFormat: 4002 });
        result2 = await db.execute(qry2, [ farm_id ], { outFormat: 4002 });
        result.rows.map(v => v['products'] = result2.rows.filter(v2 => v2['application_id'] === v['application_id']));
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
		getCertificates,
    SCHEMA,
    TABLE,
    ATTR
}
