const oracle                = require('../../config/db'),
      logger                = require('../utils/logger'),
      san_ident_animal      = require('./san_ident_animal'),
      san_ident_animal_pred = require('./san_ident_animal_pred');

const SCHEMA='SIGIA',
      TABLE='SAN_INDET_ANIMAL_DETALLE',
      ATTR={
        IDIDEN:           ['IDIDEN'          , 'ididen'],
        SECUENCIAL:       ['SECUENCIAL'      , 'secuencial'],
        SECUENCIAL_ARETE: ['SECUENCIAL_ARETE', 'secuencial_arete'],
        COD_ARETE:        ['COD_ARETE'       , 'cod_arete'],
        SEXO:             ['SEXO'            , 'gender'],
        EDAD:             ['EDAD'            , 'age'],
        ALTA_BAJA:        ['ALTA_BAJA'       , 'high_low'],
        ESP_ANI:          ['ESP_ANI'         , 'animal_specie'],
        USER_CREA:        ['USER_CREA'       , 'user_crea'],
        FECH_CREA:        ['FECH_CREA'       , 'fech_crea'],
        USER_MODI:        ['USER_MODI'       , 'user_modi'],
        FECH_MODI:        ['FECH_MODI'       , 'fech_modi'],
        TYPE_:            ['TYPE_'          , 'type'],
      };

const get = async (cols, where, value, is_active) => {
    let result, qry, db;

    qry = `SELECT ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.CODI_PRED_PRE[0]} AS "${san_ident_animal_pred.ATTR.CODI_PRED_PRE[1]}",
                  ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.CODI_SEDE_SED[0]} AS "${san_ident_animal.ATTR.CODI_SEDE_SED[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.NOMB_PRED_PRE[0]} AS "${san_ident_animal_pred.ATTR.NOMB_PRED_PRE[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.CODI_DEPA_PRO[0]} AS "${san_ident_animal_pred.ATTR.CODI_DEPA_PRO[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.CODI_PROV_PRO[0]} AS "${san_ident_animal_pred.ATTR.CODI_PROV_PRO[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.CODI_DIST_PRO[0]} AS "${san_ident_animal_pred.ATTR.CODI_DIST_PRO[1]}",
                  ${TABLE}.${ATTR.USER_CREA[0]} AS "${ATTR.USER_CREA[1]}",
                  ${TABLE}.${ATTR.FECH_CREA[0]} AS "${ATTR.FECH_CREA[1]}",
                  ${TABLE}.${ATTR.USER_MODI[0]} AS "${ATTR.USER_MODI[1]}",
                  ${TABLE}.${ATTR.FECH_MODI[0]} AS "${ATTR.FECH_MODI[1]}",
                  ${TABLE}.${ATTR.IDIDEN[0]} AS "${ATTR.IDIDEN[1]}",
                  CONCAT(CONCAT(${TABLE}.${ATTR.IDIDEN[0]}, ${TABLE}.${ATTR.SECUENCIAL[0]}), ${TABLE}.${ATTR.SECUENCIAL_ARETE[0]}) AS "id",
                  ${TABLE}.${ATTR.SECUENCIAL[0]} AS "${ATTR.SECUENCIAL[1]}",
                  ${TABLE}.${ATTR.SECUENCIAL_ARETE[0]} AS "${ATTR.SECUENCIAL_ARETE[1]}",
                  ${TABLE}.${ATTR.COD_ARETE[0]} AS "${ATTR.COD_ARETE[1]}",
                  ${TABLE}.${ATTR.SEXO[0]} AS "${ATTR.SEXO[1]}",
                  ${TABLE}.${ATTR.EDAD[0]} AS "${ATTR.EDAD[1]}",
                  ${TABLE}.${ATTR.ALTA_BAJA[0]} AS "${ATTR.ALTA_BAJA[1]}",
                  ${TABLE}.${ATTR.ESP_ANI[0]} AS "${ATTR.ESP_ANI[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.DIRECCION[0]} AS "${san_ident_animal_pred.ATTR.DIRECCION[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.LATID_DEC_PRE[0]} AS "${san_ident_animal_pred.ATTR.LATID_DEC_PRE[1]}",
                  ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.LONG_DEC_PRE[0]} AS "${san_ident_animal_pred.ATTR.LONG_DEC_PRE[1]}",
                  ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.CODI_EMPL_PER[0]} AS "${san_ident_animal.ATTR.CODI_EMPL_PER[1]}",
                  ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.NOMB_PROD_PRO[0]} AS "${san_ident_animal.ATTR.NOMB_PROD_PRO[1]}",
                  ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.DIRE_PROD_PRO[0]} AS "${san_ident_animal.ATTR.DIRE_PROD_PRO[1]}",
                  ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.RUC_PROD_PRO[0]} AS "${san_ident_animal.ATTR.RUC_PROD_PRO[1]}",
                  'san_ident_animal_detalle' AS "${ATTR.TYPE_[1]}"
            FROM ${SCHEMA}.${TABLE}
            INNER JOIN ${SCHEMA}.${san_ident_animal_pred.TABLE}
            ON (${TABLE}.${ATTR.IDIDEN[0]} = ${san_ident_animal_pred.TABLE}.${ATTR.IDIDEN[0]}
                AND ${TABLE}.${ATTR.SECUENCIAL[0]} = ${san_ident_animal_pred.TABLE}.${ATTR.SECUENCIAL[0]}
            )
            INNER JOIN ${san_ident_animal.SCHEMA}.${san_ident_animal.TABLE}
            ON (${san_ident_animal_pred.TABLE}.${ATTR.IDIDEN[0]} = ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.IDIDEN[0]})
            WHERE 1=1 `;

    if (where.length > 0) {
        qry += `AND REGEXP_REPLACE(UPPER(${TABLE}.${where}), '\\s|\-|PE|SENASA','') LIKE UPPER(:flexibleValue)`
    }
    console.log(qry);

    try{
        db = await oracle.connect();
        let flexibleValue = value.toUpperCase().replaceAll("SENASA","").replaceAll("PE","").replaceAll(" ", "").replaceAll("-","");
        if (flexibleValue.includes('PO')) {
            flexibleValue = '%' + 'PO' + '%'+ flexibleValue.replace('PO','') + '%';
        } else if (flexibleValue.includes('BO')){
            flexibleValue = '%' + 'BO' + '%'+ flexibleValue.replace('BO','') + '%';
        } else {
            flexibleValue = '%' + flexibleValue + '%';
        }
        console.log(flexibleValue);
        result = await db.execute(qry, [ flexibleValue ], { outFormat: 4002 });
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
