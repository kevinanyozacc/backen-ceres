const oracle                   = require('../../config/db');

const SCHEMA='SIGIA',
      TABLE='SAN_IDENT_ANIMAL_PRED',
      ATTR={
        CODI_PRED_PRE:  ['CODI_PRED_PRE'  , 'codi_pred_pre'],
        NOMB_PRED_PRE:  ['NOMB_PRED_PRE'  , 'nomb_pred_pre'],
        CODI_DEPA_PRO:  ['CODI_DEPA_PRO'  , 'codi_depa_pro'],
        CODI_PROV_PRO:  ['CODI_PROV_PRO'  , 'codi_prov_pro'],
        CODI_DIST_PRO:  ['CODI_DIST_PRO'  , 'codi_dist_pro'],
        DIRECCION:      ['DIRECCION'      , 'direccion'],
        LATID_DEC_PRE:  ['LATID_DEC_PRE'  , 'latid_dec_pre'],
        LONG_DEC_PRE:   ['LONG_DEC_PRE'   , 'long_dec_pre'],
        IDIDEN:         ['IDIDEN'         , 'ididen'],
        SECUENCIAL:     ['SECUENCIAL'     , 'secuencial'],
      };

module.exports = {
    SCHEMA,
    TABLE,
    ATTR
}
