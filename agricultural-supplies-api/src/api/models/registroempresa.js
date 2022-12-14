const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSVE',
      TABLE='REGISTRO_EMPRESA_GIRO',
      ATTR={
          ANNO_SOLI_EMP:  ['ANNO_SOLI_EMP' , 'year'],
          CODI_DEPA_DPT:  ['CODI_DEPA_DPT' , 'department'],
          CODI_DIST_TDI:  ['CODI_DIST_TDI' , 'district'],
          CODI_PROV_TPR:  ['CODI_PROV_TPR' , 'province'],
          CODI_SEDE_SED:  ['CODI_SEDE_SED' , 'hq'],
          DIRE_LEGA_EMP:  ['DIRE_LEGA_EMP' , 'address_legal'],
          FECH_CREA:      ['FECH_CREA'     , 'start_date'],
          ESPE_FECH_CIE:  ['ESPE_FECH_CIE' , 'end_date'],
          GIRO_EMPR_EMP:  ['GIRO_EMPR_EMP' , 'line'],
          NRUC_EMPR_EMP:  ['NRUC_EMPR_EMP' , 'ruc'],
          NUME_EXPE_EXP:  ['NUME_EXPE_EXP' , 'file_code'],
          NUME_REGI_EMP:  ['NUME_REGI_EMP' , 'id'],
          NUME_SOLI_EMP:  ['NUME_SOLI_EMP' , 'request_code'],
          EMAIL_EMPR_EMP: ['EMAIL_EMPR_EMP', 'email_empr_emp'],
          REPR_LEGA_EMP:  ['REPR_LEGA_EMP' , 'repr_lega_emp'],
          RAZO_SOCI_EMP:  ['RAZO_SOCI_EMP' , 'name'],
          TELE_EMPR_EMP:  ['TELE_EMPR_EMP' , 'tele_empr_emp'],
          TIPO_EMPRESA:   ['TIPO_EMPRESA'  , 'category'],
      };

const getByID = async (id, cols) => {
    let result;

    qry  = `SELECT 'agricultural-supplies' AS "type", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}\nWHERE ${TABLE}.${ATTR.NUME_REGI_EMP[0]}=:id`;

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        await db.close();
    }catch(err){
        logger.error(err);
    }

    return result;
}

module.exports = {
    getByID,
    SCHEMA,
    TABLE,
    ATTR
}
