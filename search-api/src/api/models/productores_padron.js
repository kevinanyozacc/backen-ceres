const oracle = require('../../config/db');

const SCHEMA='SIGSA',
      TABLE='PRODUCTORES_PADRON',
      ATTR={
        CODI_PROD_PRO:  ['CODI_PROD_PRO'  , 'codi_prod_pro'],
        CODI_EMPL_PER:  ['CODI_EMPL_PER'  , 'codi_empl_per'],
        NOMB_PROD_PRO:  ['NOMB_PROD_PRO'  , 'nomb_prod_pro'],
        DIRE_PROD_PRO:  ['DIRE_PROD_PRO'  , 'dire_prod_pro'],
        RUC_PROD_PRO:   ['RUC_PROD_PRO'   , 'ruc_prod_pro'],
      };

module.exports = {
    SCHEMA,
    TABLE,
    ATTR
}
