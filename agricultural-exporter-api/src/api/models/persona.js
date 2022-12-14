const SCHEMA='SISTEMAS',
      TABLE='PERSONA',
      ATTR={
        NOMBRES:          ['NOMBRES' 			     , 'contact_person_names'],
        APELLIDO_MATERNO: ['APELLIDO_MATERNO'  , 'contact_person_lastname_2'],
        APELLIDO_PATERNO: ['APELLIDO_PATERNO'  , 'contact_person_lastname_1'],
        TELEFONO:         ['TELEFONO'          , 'phone'],
        TELEFONO_MOVIL:   ['TELEFONO_MOVIL'    , 'mobile_phone'],
        DIRECCION:        ['DIRECCION'         , 'address_legal'],
        DOCUMENTO_TIPO:   ['DOCUMENTO_TIPO'    , 'document_type'],
        DOCUMENTO_NUMERO: ['DOCUMENTO_NUMERO'  , 'document_number'],
        RUC:              ['RUC'               , 'persona_ruc'],
        DEPARTAMENTO_ID:  ['DEPARTAMENTO_ID'   , 'department'],
        PROVINCIA_ID:     ['PROVINCIA_ID'      , 'province'],
        DISTRITO_ID:      ['DISTRITO_ID'       , 'district'],
        FECH_CREA:        ['FECH_CREA'         , 'start_date'],
        FECH_MODI:        ['FECH_MODI'         , 'fech_modi'],
        ESTADO:           ['ESTADO'            , 'is_active'],
        NAME:             ['NOMBRE_RAZON_SOCIAL', 'name'],
      };

module.exports = {
    SCHEMA,
    TABLE,
    ATTR
}
