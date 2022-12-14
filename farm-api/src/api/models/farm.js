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
        ADDRESS_REAL:   ['ADDRESS_REAL'   , 'address_real'],
        STATE:          ['STATE'          , 'state'],
        NAME:           ['NAME'           , 'name'],
        GEO_LAT:        ['GEO_LAT'        , 'geo_lat'],
        GEO_LONG:       ['GEO_LONG'       , 'geo_long'],
        START_DATE:     ['START_DATE'     , 'start_date'],
        FECH_MODI:      ['FECH_MODI'      , 'fech_modi'],
        END_DATE:       ['END_DATE'       , 'end_date'],
        YEAR:           ['YEAR'           , 'year'],
        AREA:           ['AREA'           , 'area'],
        PRO_ID:         ['PRO_ID'         , 'farmer_id'],
        PRO_STATE:      ['PRO_STATE'      , 'farmer_state'],
        PRO_NAME:       ['PRO_NAME'       , 'farmer_name'],
        PRO_TYPE:       ['PRO_TYPE'       , 'farmer_type'],
        PRO_DNI:        ['PRO_DNI'        , 'farmer_dni'],
        PRO_COMPANY:    ['PRO_COMPANY'    , 'farmer_company_name'],
        PRO_RUC:        ['PRO_RUC'        , 'farmer_ruc'],
        PRO_ADDRESS:    ['PRO_ADDRESS'    , 'farmer_address'],
        PRO_PHONE:      ['PRO_PHONE'      , 'farmer_phone'],
        PRO_EMAIL:      ['PRO_EMAIL'      , 'farmer_email'],
        REG_PRED:       ['REG_PRED'       , 'reg_farm_id'],
        FLAG_BPP:       ['FLAG_BPP'       , 'farm_bpp'],
        FLAG_BPA:       ['FLAG_BPA'       , 'farm_bpa'],
      };

const getByID = async (id, cols) => {
    let result, qry, db;

    qry  = `SELECT `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM (
    `;
    qry += await getSelectPredios();
    qry += `) FARMS
    `;
    qry += `WHERE ${TABLE}.${ATTR.ID[0]}=UPPER(:id)`;

    console.log(qry);

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

const getSelectPredios = async() => {
    return `SELECT CONCAT(CONCAT(PREDIOS.CODI_SEDE_SED, PREDIOS.CODI_PROD_MOS), CODI_PRED_MOS) AS "ID",
                   PREDIOS.CODI_SEDE_SED                                                       AS "HQ",
                   PREDIOS.CODI_DEPA_DPT                                                       AS "DEPARTMENT",
                   PREDIOS.CODI_DIST_TDI                                                       AS "DISTRICT",
                   PREDIOS.CODI_PROV_TPR                                                       AS "PROVINCE",
                   PREDIOS.DIRECCION_PREDIO                                                    AS "ADDRESS_REAL",
                   PREDIOS.ESTA_PRED_MOS                                                       AS "STATE",
                   PREDIOS.NOMB_PRED_MOS                                                       AS "NAME",
                   PREDIOS.LATI_TRAM_TRA                                                       AS "GEO_LAT",
                   PREDIOS.LONG_TRAM_TRA                                                       AS "GEO_LONG",
                   PREDIOS.FECH_CREA                                                           AS "START_DATE",
                   PREDIOS.FECH_MODI                                                           AS "FECH_MODI",
                   PREDIOS.FECH_CREA                                                           AS "END_DATE",
                   CAST(EXTRACT(YEAR FROM PREDIOS.FECH_CREA) AS CHAR(4))                       AS "YEAR",
                   PREDIOS.AREA_PRED_MOS                                                       AS "AREA",
                   lpad((CASE PATRON_PRODUCTORES.TIPO_PROD_MOS WHEN 'J' THEN PATRON_PRODUCTORES.RUC_PROD_MOS ELSE PATRON_PRODUCTORES.IDEN_PROD_MOS END), 5, '0') AS "PRO_ID",
                   PATRON_PRODUCTORES.ESTA_REGI_PRD                                            AS "PRO_STATE",
                   PATRON_PRODUCTORES.TIPO_PROD_MOS                                            AS "PRO_TYPE",
                   PATRON_PRODUCTORES.PATRON_PRODUCTORES.RAZO_PROD_MOS                         AS "PRO_COMPANY",
                   PATRON_PRODUCTORES.DIRE_PROD_MOS                                            AS "PRO_ADDRESS",
                   PATRON_PRODUCTORES.TELE_PROD_MOS                                            AS "PRO_PHONE",
                   PATRON_PRODUCTORES.CORR_ELEC_MOS                                            AS "PRO_EMAIL",
                   PATRON_PRODUCTORES.NOMB_PROD_MOS || ' ' || PATRON_PRODUCTORES.APES_PROD_MOS AS "PRO_NAME",
                   PATRON_PRODUCTORES.IDEN_PROD_MOS                                            AS "PRO_DNI",
                   PATRON_PRODUCTORES.RUC_PROD_MOS                                             AS "PRO_RUC",
                   PREDIOS.NRO_REGISTRO_PRED                                                   AS "REG_PRED",
                   PREDIOS.flag_bpp                                                            AS "FLAG_BPP",
                   PREDIOS.flag_bpa                                                            AS "FLAG_BPA"
            FROM SIIMF.PREDIOS
            LEFT JOIN SIIMF.PATRON_PRODUCTORES ON (PREDIOS.CODI_PROD_MOS = PATRON_PRODUCTORES.CODI_PROD_MOS AND PREDIOS.CODI_SEDE_SED = PATRON_PRODUCTORES.CODI_SEDE_SED)`
}


module.exports = {
    getByID,
    SCHEMA,
    TABLE,
    ATTR
}