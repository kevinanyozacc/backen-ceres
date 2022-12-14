const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSA',
      TABLE='FARMS',
      ATTR={
        ID:             ['ID'             , 'id'],
        HQ:             ['HQ'             , 'hq'],
        DEPARTMENT:     ['DEPARTMENT'     , 'department'],
        DISTRICT:       ['DISTRICT'       , 'district'],
        PROVINCE:       ['PROVINCE'       , 'province'],
        STATE:          ['STATE'          , 'state'],
        NAME:           ['NAME'           , 'name'],
        GEO_LAT:        ['GEO_LAT'        , 'geo_lat'],
        GEO_LONG:       ['GEO_LONG'       , 'geo_long'],
        START_DATE:     ['START_DATE'     , 'start_date'],
        FECH_MODI:      ['FECH_MODI'      , 'fech_modi'],
        END_DATE:       ['END_DATE'       , 'end_date'],
        YEAR:           ['YEAR'           , 'year'],
        PRO_NAME:       ['PRO_NAME'       , 'farmer_name'],
        PRO_DNI:        ['PRO_DNI'        , 'farmer_dni'],
        PRO_RUC:        ['PRO_RUC'        , 'farmer_ruc']
      };
        
const get = async (cols, where, value) => {
    let result, qry, db;

    qry  = `SELECT `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM (
    `;
    // qry += await getSelectPrediosPadron();
    // qry += `
    // UNION ALL
    // `;
    qry += await getSelectPredios();
    qry += `) FARMS
    `;
    qry += `WHERE `;
    qry += await utils.makeWhere(where, TABLE, ATTR);

    console.log(qry);

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ '%' + value.trim() + '%' ], { outFormat: 4002 });
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


const getSelectPredios = async() => {
    return `SELECT CONCAT(CONCAT(PREDIOS.CODI_SEDE_SED, PREDIOS.CODI_PROD_MOS), CODI_PRED_MOS) AS "ID",
                   PREDIOS.CODI_SEDE_SED                                                       AS "HQ",
                   PREDIOS.CODI_DEPA_DPT                                                       AS "DEPARTMENT",
                   PREDIOS.CODI_DIST_TDI                                                       AS "DISTRICT",
                   PREDIOS.CODI_PROV_TPR                                                       AS "PROVINCE",
                   PREDIOS.ESTA_PRED_MOS                                                       AS "STATE",
                   PREDIOS.NOMB_PRED_MOS                                                       AS "NAME",
                   PREDIOS.LATI_TRAM_TRA                                                       AS "GEO_LAT",
                   PREDIOS.LONG_TRAM_TRA                                                       AS "GEO_LONG",
                   PREDIOS.FECH_CREA                                                           AS "START_DATE",
                   PREDIOS.FECH_MODI                                                           AS "FECH_MODI",
                   PREDIOS.FECH_CREA                                                           AS "END_DATE",
                   CAST(EXTRACT(YEAR FROM PREDIOS.FECH_CREA) AS CHAR(4))                       AS "YEAR",
                   PATRON_PRODUCTORES.NOMB_PROD_MOS || ' ' || PATRON_PRODUCTORES.APES_PROD_MOS AS "PRO_NAME",
                   IDEN_PROD_MOS  AS "PRO_DNI",
                   RUC_PROD_MOS  AS "PRO_RUC"
            FROM SIIMF.PREDIOS
            LEFT JOIN SIIMF.PATRON_PRODUCTORES ON (PREDIOS.CODI_PROD_MOS = PATRON_PRODUCTORES.CODI_PROD_MOS AND PREDIOS.CODI_SEDE_SED = PATRON_PRODUCTORES.CODI_SEDE_SED)
            WHERE PREDIOS.ESTA_PRED_MOS = 'A'
            `
}

const getSelectPrediosPadron = async() => {
    return `SELECT PREDIOS_PADRON.CODI_PRED_PRE       AS "ID",
                   PREDIOS_PADRON.DIRE_PROP_PRE       AS "ADDRESS",
                   PREDIOS_PADRON.CODI_SEDE_SED       AS "HQ",
                   PREDIOS_PADRON.CODI_DEPA_PRE       AS "DEPARTMENT",
                   PREDIOS_PADRON.CODI_DIST_PRE       AS "DISTRICT",
                   PREDIOS_PADRON.CODI_PROV_PRE       AS "PROVINCE",
                   PREDIOS_PADRON.ESTADO              AS "STATE",
                   PREDIOS_PADRON.GEOGRAFICA_LONGITUD AS "CENT_LAT",
                   PREDIOS_PADRON.GEOGRAFICA_LATITUD  AS "CENT_LONG",
                   PREDIOS_PADRON.FECH_CREA           AS "START_DATE",
                   PREDIOS_PADRON.FECH_MODI           AS "MODI_DATE",
                   PREDIOS_PADRON.NOMB_PRED_PRE       AS "NAME",
                   PREDIOS_PADRON.CODI_PROD_PRO       AS "PRO_ID",
                   PRODUCTORES_PADRON.RAZO_SOCI_PRO   AS "PRO_NAME",
                   PRODUCTORES_PADRON.CESTADO         AS "PRO_STATE",
                   PRODUCTORES_PADRON.CODI_DEPA_PRO   AS "PRO_DEPARTMENT",
                   PRODUCTORES_PADRON.CODI_DIST_PRO   AS "PRO_DISTRICT",
                   PRODUCTORES_PADRON.CODI_PROV_PRO   AS "PRO_PROVINCE",
                   PRODUCTORES_PADRON.CODI_SEDE_SED   AS "PRO_HQ",
                   PRODUCTORES_PADRON.LATI_PROD_PRO   AS "PRO_CENT_LAT",
                   PRODUCTORES_PADRON.LONG_PROD_PRO   AS "PRO_CENT_LONG",
                   PRODUCTORES_PADRON.FECH_CREA       AS "PRO_START_DATE",
                   PRODUCTORES_PADRON.FECH_MODI       AS "PRO_MODI_DATE"
            FROM SIGSA.PREDIOS_PADRON
            LEFT JOIN SIGSA.PRODUCTORES_PADRON ON PREDIOS_PADRON.CODI_PROD_PRO = PRODUCTORES_PADRON.CODI_PROD_PRO`
}

module.exports = {
    get,
    SCHEMA,
    TABLE,
    ATTR
}