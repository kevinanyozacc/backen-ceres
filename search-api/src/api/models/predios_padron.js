const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      productores_predios = require('./productores_predios'),
      productores_padron = require('./productores_padron');

const SCHEMA='SIGSA',
      TABLE='PREDIOS_PADRON',
      ATTR={
        CODI_PRED_PRE:  ['CODI_PRED_PRE'  , 'codi_pred_pre'],
        CODI_SEDE_SED:  ['CODI_SEDE_SED'  , 'codi_sede_sed'],
        NOMB_PRED_PRE:  ['NOMB_PRED_PRE'  , 'nomb_pred_pre'],
        CODI_DEPA_PRO:  ['CODI_DEPA_PRO'  , 'codi_depa_pro'],
        CODI_PROV_PRO:  ['CODI_PROV_PRO'  , 'codi_prov_pro'],
        CODI_DIST_PRO:  ['CODI_DIST_PRO'  , 'codi_dist_pro'],
        TELE_PROP_PRE:  ['TELE_PROP_PRE'  , 'tele_prop_pre'],
        CELU_PROP_PRE:  ['CELU_PROP_PRE'  , 'celu_prop_pre'],
        EMAIL_PROP_PRE: ['EMAIL_PROP_PRE' , 'email_prop_pre'],
        USER_CREA:      ['USER_CREA'      , 'user_crea'],
        FECH_CREA:      ['FECH_CREA'      , 'fech_crea'],
        USER_MODI:      ['USER_MODI'      , 'user_modi'],
        FECH_MODI:      ['FECH_MODI'      , 'fech_modi'],
        CODI_PROD_PRO:  ['CODI_PROD_PRO'  , 'codi_prod_pro'],
        DIRECCION:      ['DIRECCION'      , 'direccion'],
        LATID_DEC_PRE:  ['LATID_DEC_PRE'  , 'latid_dec_pre'],
        LONG_DEC_PRE:   ['LONG_DEC_PRE'   , 'long_dec_pre'],
        TYPE_:          ['TYPE_'          , 'type'],
      };

const get = async (cols, where, value, is_active) => {
    let result, qry, db;

    qry = `SELECT ${TABLE}.${ATTR.CODI_PRED_PRE[0]} AS "${ATTR.CODI_PRED_PRE[1]}",
                  ${TABLE}.${ATTR.CODI_SEDE_SED[0]} AS "${ATTR.CODI_SEDE_SED[1]}",
                  ${TABLE}.${ATTR.NOMB_PRED_PRE[0]} AS "${ATTR.NOMB_PRED_PRE[1]}",
                  ${TABLE}.${ATTR.CODI_DEPA_PRO[0]} AS "${ATTR.CODI_DEPA_PRO[1]}",
                  ${TABLE}.${ATTR.CODI_PROV_PRO[0]} AS "${ATTR.CODI_PROV_PRO[1]}",
                  ${TABLE}.${ATTR.CODI_DIST_PRO[0]} AS "${ATTR.CODI_DIST_PRO[1]}",
                  ${TABLE}.${ATTR.TELE_PROP_PRE[0]} AS "${ATTR.TELE_PROP_PRE[1]}",
                  ${TABLE}.${ATTR.CELU_PROP_PRE[0]} AS "${ATTR.CELU_PROP_PRE[1]}",
                  ${TABLE}.${ATTR.EMAIL_PROP_PRE[0]} AS "${ATTR.EMAIL_PROP_PRE[1]}",
                  ${TABLE}.${ATTR.USER_CREA[0]} AS "${ATTR.USER_CREA[1]}",
                  ${TABLE}.${ATTR.FECH_CREA[0]} AS "${ATTR.FECH_CREA[1]}",
                  ${TABLE}.${ATTR.USER_MODI[0]} AS "${ATTR.USER_MODI[1]}",
                  ${TABLE}.${ATTR.FECH_MODI[0]} AS "${ATTR.FECH_MODI[1]}",
                  ${TABLE}.${ATTR.CODI_PROD_PRO[0]} AS "${ATTR.CODI_PROD_PRO[1]}",
                  ${TABLE}.${ATTR.DIRECCION[0]} AS "${ATTR.DIRECCION[1]}",
                  ${TABLE}.${ATTR.LATID_DEC_PRE[0]} AS "${ATTR.LATID_DEC_PRE[1]}",
                  ${TABLE}.${ATTR.LONG_DEC_PRE[0]} AS "${ATTR.LONG_DEC_PRE[1]}",
                  ${productores_padron.TABLE}.${productores_padron.ATTR.CODI_EMPL_PER[0]} AS "${productores_padron.ATTR.CODI_EMPL_PER[1]}",
                  ${productores_padron.TABLE}.${productores_padron.ATTR.NOMB_PROD_PRO[0]} AS "${productores_padron.ATTR.NOMB_PROD_PRO[1]}",
                  ${productores_padron.TABLE}.${productores_padron.ATTR.DIRE_PROD_PRO[0]} AS "${productores_padron.ATTR.DIRE_PROD_PRO[1]}",
                  ${productores_padron.TABLE}.${productores_padron.ATTR.RUC_PROD_PRO[0]} AS "${productores_padron.ATTR.RUC_PROD_PRO[1]}",
                  'predios_padron' AS "${ATTR.TYPE_[1]}"
            FROM ${SCHEMA}.${TABLE}
            INNER JOIN ${productores_predios.SCHEMA}.${productores_predios.TABLE}
            ON (${TABLE}.${ATTR.CODI_PRED_PRE[0]} = ${productores_predios.TABLE}.${productores_predios.ATTR.CODI_PRED_PRE[0]})
            INNER JOIN ${productores_padron.SCHEMA}.${productores_padron.TABLE}
            ON (${productores_predios.TABLE}.${productores_predios.ATTR.CODI_PROD_PRO[0]} = ${productores_padron.TABLE}.${productores_padron.ATTR.CODI_PROD_PRO[0]})
            WHERE 1=1 `;

    if (where.length > 0) {
        qry += `AND UPPER(${TABLE}.${where.toUpperCase()}) LIKE UPPER(:value)`
    }
    
    console.log(qry);

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ '\'%' + value.trim() + '%\'' ], { outFormat: 4002 });
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
    get,
    SCHEMA,
    TABLE,
    ATTR
}
