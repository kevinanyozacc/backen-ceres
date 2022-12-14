const SCHEMA='FINALBPM',
      TABLE='PRG_EXP_CERTIFICADO_PLANTA_ESP',
      ATTR={
        CODIGO_ESPECIE: ['CODIGO_ESPECIE', 'specie'],
        CODIGO_PRODUCTO: ['CODIGO_PRODUCTO', 'product_code'],
        ESTADO:    ['ESTADO'     , 'product_state']
      };

module.exports = {
    SCHEMA,
    TABLE,
    ATTR
}