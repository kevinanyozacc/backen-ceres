const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSA',
      TABLE='DEFENSA_TRANSITO',
      ATTR={
          CODI_CBEN_CBE:       ['CODI_CBEN_CBE'       , 'id'],
          NUME_CSTI_TRA:       ['NUME_CSTI_TRA'       , 'csti_id'],
          DIAS_AUTO_TRA:       ['DIAS_AUTO_TRA'       , 'valid_days'],
          FECH_CREA:           ['FECH_CREA'           , 'start_date'],
          FECH_CSTI_TRA:       ['FECH_CSTI_TRA'       , 'valid_start_date'],
          NOMB_RESP_CER:       ['NOMB_RESP_CER'       , 'contact_person'],
          CODI_DEPA_ORI:       ['CODI_DEPA_ORI'       , 'department_origin'],
          CODI_PROV_ORI:       ['CODI_PROV_ORI'       , 'province_origin'],
          CODI_DIST_ORI:       ['CODI_DIST_ORI'       , 'district_origin'],
          CCODEXP:             ['CCODEXP'             , 'file_code'],
          CODI_DIST_ORI:       ['CODI_DIST_ORI'       , 'district_origin'],
          NUME_DOCU_DNI:       ['NUME_DOCU_DNI'       , 'contact_person_dni'],
          TIPO_RESP_CER:       ['TIPO_RESP_CER'       , 'contact_person_type'],
      };

const getCSTI = async (id, cols) => {
    let result, result2, qry, qry2, db;
    // Obtiene los csti de los últimos 30 días
    qry  = `SELECT 'csti' AS "type", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE} `;
    qry += `WHERE ${TABLE}.${ATTR.CODI_CBEN_CBE[0]}=:id AND FECH_CREA >= (TRUNC(SYSDATE) - 450)`;

    // Obtiene el predio de origen de aquellos productores que tienen solo una correspondencia
    qry2 = `SELECT X."csti_id", 
            CONCAT(CONCAT(PATRON_PRODUCTORES.CODI_SEDE_SED, PATRON_PRODUCTORES.CODI_PROD_MOS), MAX(PREDIOS.CODI_PRED_MOS)) AS "farm_id",
            PATRON_PRODUCTORES.CODI_SEDE_SED, 
            PATRON_PRODUCTORES.CODI_PROD_MOS, 
            PATRON_PRODUCTORES.NOMB_PROD_MOS 
            FROM (
              SELECT recycle."csti_id", recycle."contact_person_dni" 
              FROM (${qry}) recycle 
              WHERE recycle."contact_person_type" = 'P' AND recycle."contact_person_dni" IS NOT NULL) X  
              LEFT JOIN SIIMF.PATRON_PRODUCTORES ON X."contact_person_dni" = PATRON_PRODUCTORES.IDEN_PROD_MOS 
              LEFT JOIN SIIMF.PREDIOS ON PATRON_PRODUCTORES.CODI_PROD_MOS = PREDIOS.CODI_PROD_MOS AND PATRON_PRODUCTORES.CODI_SEDE_SED = PREDIOS.CODI_SEDE_SED
            WHERE PATRON_PRODUCTORES.ESTA_REGI_PRD = 'A' 
            GROUP BY X."csti_id", PATRON_PRODUCTORES.CODI_SEDE_SED, PATRON_PRODUCTORES.CODI_PROD_MOS,PATRON_PRODUCTORES.NOMB_PROD_MOS 
            HAVING COUNT(*) = 1`;

    console.log(qry2);

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        result2 = await db.execute(qry2, [ id ], { outFormat: 4002 });
        result.rows.forEach(v => v['farm'] = result2.rows.find(v2 => v2['csti_id'] === v['csti_id']) || null)
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
	getCSTI,
    SCHEMA,
    TABLE,
    ATTR
}