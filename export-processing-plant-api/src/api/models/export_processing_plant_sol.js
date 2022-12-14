const SCHEMA='FINALBPM',
      TABLE='PRG_EXP_SOLICITUD_PLANTA',
      ATTR={
        REPRESENTANTE_LEGAL: ['REPRESENTANTE_LEGAL', 'contact_person'],
        DNI_SOLI_SOL: ['DNI_SOLI_SOL', 'contact_person_dni'],
        DIRE_SOLI_SOL:    ['DIRE_SOLI_SOL'     , 'address_real'],
        DPTO_SOLI_SOL:  ['DPTO_SOLI_SOL'   , 'department'],
        PROVI_SOLI_SOL:     ['PROV_SOLI_SOL'      , 'province'],
        DIST_SOLI_SOL:      ['DIST_SOLI_SOL'       , 'district'],
        CCODEXP:             ['CCODEXP', 'file_id'],
      };

module.exports = {
    SCHEMA,
    TABLE,
    ATTR
}
