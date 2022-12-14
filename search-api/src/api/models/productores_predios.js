const oracle = require('../../config/db');

const SCHEMA='SIGSA',
      TABLE='PRODUCTORES_PREDIOS',
      ATTR={
        CODI_PRED_PRE:  ['CODI_PRED_PRE'  , 'codi_pred_pre'],
        CODI_PROD_PRO:  ['CODI_PROD_PRO'  , 'codi_prod_pro'],
      };

module.exports = {
    SCHEMA,
    TABLE,
    ATTR
}
