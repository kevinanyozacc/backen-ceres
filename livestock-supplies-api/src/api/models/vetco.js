const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA='SIGSA',
      TABLE='DIP_EMPRESAS_VETERINARIO',
      ATTR={
        REGI_PADR_EMP:    ['REGI_PADR_EMP'   , 'id'],
        ANNO_SOLI_EST:    ['ANNO_SOLI_EST'   , 'year'],
        CCODCLI:          ['CCODCLI'         , 'ccodcli'],
        CODI_DEPA_DPT:    ['CODI_DEPA_DPT'   , 'department'],
        CODI_PROV_TPR:    ['CODI_PROV_TPR'   , 'province'],
        CODI_DIST_TDI:    ['CODI_DIST_TDI'   , 'district'],
        CODI_EMPL_PER:    ['CODI_EMPL_PER'   , 'codi_empl_per'],
        CODI_SECU_EMP:    ['CODI_SECU_EMP'   , 'codi_secu_emp'],
        RUC_EMPR_VET:     ['RUC_EMPR_VET'    , 'ruc'],
        CODI_SEDE_SED:    ['CODI_SEDE_SED'   , 'hq'],
        DIRE_LEGA_VET:    ['DIRE_LEGA_VET'   , 'address_legal'],
        DIRE_REAL_VET:    ['DIRE_REAL_VET'   , 'address_real'],
        EMAI_EMPR_VET:    ['EMAI_EMPR_VET'   , 'emai_empr_vet'],
        ESTA_EMPR_VET:    ['ESTA_EMPR_VET'   , 'is_active'],
        FECH_EXPE_MUN:    ['FECH_EXPE_MUN'   , 'start_date'],
        FECH_REGI_EMP:    ['FECH_REGI_EMP'   , 'end_date'],
        FAX_EMPR_VET:     ['FAX_EMPR_VET'    , 'fax_empr_vet'],
        FECH_CREA:        ['FECH_CREA'       , 'fech_crea'],
        FECH_MODI:        ['FECH_MODI'       , 'fech_modi'],
        FEEX_DIST_VET:    ['FEEX_DIST_VET'   , 'feex_dist_vet'],
        FEVE_DIST_VET:    ['FEVE_DIST_VET'   , 'feve_dist_vet'],
        FLAG_DIST_VET:    ['FLAG_DIST_VET'   , 'flag_dist_vet'],
        FLAG_ENVA_VET:    ['FLAG_ENVA_VET'   , 'flag_enva_vet'],
        FLAG_EXPE_VET:    ['FLAG_EXPE_VET'   , 'flag_expe_vet'],
        FLAG_EXPO_VET:    ['FLAG_EXPO_VET'   , 'flag_expo_vet'],
        FLAG_FABR_ALI:    ['FLAG_FABR_ALI'   , 'flag_fabr_ali'],
        FLAG_FABR_ALIMED: ['FLAG_FABR_ALIMED', 'flag_fabr_alimed'],
        FLAG_FABR_BIO:    ['FLAG_FABR_BIO'   , 'flag_fabr_bio'],
        FLAG_FABR_FAR:    ['FLAG_FABR_FAR'   , 'flag_fabr_far'],
        FLAG_FABR_VET:    ['FLAG_FABR_VET'   , 'flag_fabr_vet'],
        FLAG_IMPO_VET:    ['FLAG_IMPO_VET'   , 'flag_impo_vet'],
        LICE_FUNC_MUN:    ['LICE_FUNC_MUN'   , 'lice_func_mun'],
        NUME_DOCU_VET:    ['NUME_DOCU_VET'   , 'document_code'],
        RAZO_SOCI_VET:    ['RAZO_SOCI_VET'   , 'name'],
        REGI_PROF_PPR:    ['REGI_PROF_PPR'   , 'regi_prof_ppr'],
        REGI_SOLI_EST:    ['REGI_SOLI_EST'   , 'regi_soli_est'],
        REPR_LEGA_VET:    ['REPR_LEGA_VET'   , 'repr_lega_vet'],
        TELF_EMPR_VET:    ['TELF_EMPR_VET'   , 'telf_empr_vet'],
        TIPO_DOCU_IDE:    ['TIPO_DOCU_IDE'   , 'document_type'],
        USER_CREA:        ['USER_CREA'       , 'user_crea'],
        USER_MODI:        ['USER_MODI'       , 'user_modi'],
      };

const getByID = async (id, cols) => {
    let result;

    qry  = `SELECT 'livestock-supplies' AS "type", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}\nWHERE ${TABLE}.${ATTR.REGI_PADR_EMP[0]}=:id`;

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