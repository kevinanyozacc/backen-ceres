const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSA',
      TABLE='CENTRO_BENEFICIO_PADRON',
      ATTR={
          CODI_CBEN_CBE:       ['CODI_CBEN_CBE'       , 'id'],
          CATEGORIA:           ['CATEGORIA'           , 'category'],
          CODI_DEPA_CBE:       ['CODI_DEPA_CBE'       , 'department'],
          CODI_PROV_CBE:       ['CODI_PROV_CBE'       , 'province'],
          CODI_DIST_CBE:       ['CODI_DIST_CBE'       , 'district'],
          CODI_SEDE_SED:       ['CODI_SEDE_SED'       , 'hq'],
          DIRE_CBEN_CBE:       ['DIRE_CBEN_CBE'       , 'address_real'],
          CODI_MEDI_VET:       ['CODI_MEDI_VET'       , 'vet_code'],
          START_DATE:          ['FECH_CREA'           , 'start_date'],
          FECH_MODI:           ['FECH_MODI'           , 'fech_modi'],
          GEOGRAFICA_LATITUD:  ['GEOGRAFICA_LATITUD'  , 'geo_lat'],
          GEOGRAFICA_LONGITUD: ['GEOGRAFICA_LONGITUD' , 'geo_long'],
          LOCA_CBEN_CBE:       ['LOCA_CBEN_CBE'       , 'location'],
          RAZO_SOCI_CBE:       ['RAZO_SOCI_CBE'       , 'name'],
          NOMB_PROP_CBE:       ['NOMB_PROP_CBE'       , 'contact_person'],
          RUC_CBEN_CBE:        ['RUC_CBEN_CBE'        , 'ruc'],
          TELE_CENT_BEN:       ['TELE_CENT_BEN'       , 'phone'],
          EMAI_CENT_BEN:       ['EMAI_CENT_BEN'       , 'email'],
      };

const getByID = async (id, cols) => {
    let result, qry, db;

    qry  = `SELECT CASE WHEN CATE_CENT_BEN = 'C' THEN 'slaughterhouse' ELSE CASE WHEN CATE_CENT_BEN = 'F' THEN 'cold_meat_stores' ELSE CASE WHEN CATE_CENT_BEN = 'P' THEN 'poultry_slaughter_center' ELSE CASE WHEN CATE_CENT_BEN = 'R' THEN 'rendering' ELSE 'other'END END END END AS "type", `;
    qry += `CAST(EXTRACT(YEAR FROM FECH_CREA) AS CHAR(4)) AS "year", `;
    if (cols.includes('dni')) {
        qry += `CASE WHEN TIPO_DOCU_IDE = '01' AND NUME_DOCU_IDE IS NOT NULL THEN NUME_DOCU_IDE ELSE NULL END AS "dni", `;
    }
    if (cols.includes('name_medi_vet')) {
        qry += `mv.NOMB_MEDI_VET || ' ' || mv.APEL_PATE_VET || ' ' || mv.APEL_MATE_VET AS "name_medi_vet", `;
    }
    qry += `CASE WHEN ESTA_ACTI_CBE = 1 THEN '1' ELSE '0' END AS "is_active", `;
    qry += `CASE WHEN TIPO_CBEN_CBE = 'P' THEN 'Privado' ELSE CASE WHEN TIPO_CBEN_CBE = 'M' THEN 'Municipal' ELSE 'No especificado' END END AS "category_2", `;
    qry += `CASE WHEN CATE_CENT_BEN = 'C' THEN 'Matadero' ELSE CASE WHEN CATE_CENT_BEN = 'F' THEN 'Frigorífico' ELSE CASE WHEN CATE_CENT_BEN = 'P' THEN 'Centro de faenamiento' ELSE CASE WHEN CATE_CENT_BEN = 'R' THEN 'Rendering' ELSE 'No especificado' END END END END AS "line", `;

    qry += `NULL AS "end_date", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE} `;
    if (cols.includes('name_medi_vet')) {
        qry += `LEFT JOIN MEDICO_VETERINARIO_PADRON mv ON ${TABLE}.CODI_MEDI_VET = mv.CODI_MEDI_VET\n`;
    }
    qry += `WHERE ${TABLE}.${ATTR.CODI_CBEN_CBE[0]}=:id`;
    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
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
    getByID,
    SCHEMA,
    TABLE,
    ATTR
}