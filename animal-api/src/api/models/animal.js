const oracle                = require('../../config/db'),
      logger                = require('../utils/logger'),
      utils                 = require('../utils/utils'),
      san_ident_animal      = require('./san_ident_animal'),
      san_ident_animal_pred = require('./san_ident_animal_pred');

const SCHEMA='SIGIA',
      TABLE='SAN_INDET_ANIMAL_DETALLE',
      ATTR={
        ID:               ['ID'              , 'id'],
        IDIDEN:           ['IDIDEN'          , 'ididen'],
        SECUENCIAL:       ['SECUENCIAL'      , 'secuencial'],
        SECUENCIAL_ARETE: ['SECUENCIAL_ARETE', 'secuencial_arete'],
        COD_ARETE:        ['COD_ARETE'       , 'cod_arete'],
        SEXO:             ['SEXO'            , 'gender'],
        EDAD:             ['EDAD'            , 'age'],
        ALTA_BAJA:        ['ALTA_BAJA'       , 'high_low'],
        ESP_ANI:          ['ESP_ANI'         , 'animal_specie'],
        FECH_CREA:        ['FECH_CREA'       , 'fech_crea'],
        FECH_MODI:        ['FECH_MODI'       , 'fech_modi'],
      };

const getByID = async (id, cols) => {
    let result, db;

    let qry  = `SELECT 'san_ident_animal_detalle' AS "type",
                   CONCAT(CONCAT(${TABLE}.${ATTR.IDIDEN[0]}, ${TABLE}.${ATTR.SECUENCIAL[0]}), ${TABLE}.${ATTR.SECUENCIAL_ARETE[0]}) AS "id", 
                   CONCAT(CONCAT(${san_ident_animal.TABLE}.${san_ident_animal.ATTR.CODI_SEDE_SED[0]}, ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.CODI_PROD_PRO[0]}), ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.CODI_PRED_PRE[0]}) AS "farm_id", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR) +  ",\n";
    qry += await utils.makeSelect(cols, san_ident_animal_pred.TABLE, san_ident_animal_pred.ATTR) + ",\n";
    qry += await utils.makeSelect(cols, san_ident_animal.TABLE, san_ident_animal.ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}\n
            INNER JOIN ${san_ident_animal_pred.SCHEMA}.${san_ident_animal_pred.TABLE}
            ON (${TABLE}.${ATTR.IDIDEN[0]} = ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.IDIDEN[0]}
                AND ${TABLE}.${ATTR.SECUENCIAL[0]} = ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.SECUENCIAL[0]}
            )
            INNER JOIN ${san_ident_animal.SCHEMA}.${san_ident_animal.TABLE}
            ON (${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.IDIDEN[0]} = ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.IDIDEN[0]})
            WHERE CONCAT(CONCAT(${TABLE}.${ATTR.IDIDEN[0]}, ${TABLE}.${ATTR.SECUENCIAL[0]}), ${TABLE}.${ATTR.SECUENCIAL_ARETE[0]})=:id`;

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
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

const getByEarringID = async (id, cols) => {
    let result, qry, db;
    const where = 'COD_ARETE';
    const especie = 'ESP_ANI';
    const especies = ['BOV','POR']
    qry  = `SELECT 'san_ident_animal_detalle' AS "type",
                   CONCAT(CONCAT(${TABLE}.${ATTR.IDIDEN[0]}, ${TABLE}.${ATTR.SECUENCIAL[0]}), ${TABLE}.${ATTR.SECUENCIAL_ARETE[0]}) AS "id", `;
    qry += await utils.makeSelect(cols, TABLE, ATTR) +  ",\n";
    qry += await utils.makeSelect(cols, san_ident_animal_pred.TABLE, san_ident_animal_pred.ATTR) + ",\n";
    qry += await utils.makeSelect(cols, san_ident_animal.TABLE, san_ident_animal.ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}\n
            LEFT JOIN ${san_ident_animal_pred.SCHEMA}.${san_ident_animal_pred.TABLE}
            ON (${TABLE}.${ATTR.IDIDEN[0]} = ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.IDIDEN[0]}
                AND ${TABLE}.${ATTR.SECUENCIAL[0]} = ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.SECUENCIAL[0]}
            )
            LEFT JOIN ${san_ident_animal.SCHEMA}.${san_ident_animal.TABLE}
            ON (${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.IDIDEN[0]} = ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.IDIDEN[0]})
            WHERE REGEXP_REPLACE(UPPER(${TABLE}.${where}), '\\s|\-|PE|PO|BO|SENASA','')=:flexibleValue `;

    let flexibleValue = id;
    if (id.length >= 14) {
        if (id.startsWith('604')) {
            flexibleValue = flexibleValue.replace('604','');
            qry += `AND ${TABLE}.${especie}=\'${especies[0]}\'`
        }
    } else {
        qry += `AND ${TABLE}.${especie}=\'${especies[1]}\'`
    }
    console.log(qry)
    console.log(flexibleValue)

    try{
        db = await oracle.connect();
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

const getByFarmID = async (farm_id, cols) => {
  let result, db;

  let qry  = `SELECT CONCAT(CONCAT(${TABLE}.${ATTR.IDIDEN[0]}, ${TABLE}.${ATTR.SECUENCIAL[0]}), ${TABLE}.${ATTR.SECUENCIAL_ARETE[0]}) AS "id", `;
  qry += await utils.makeSelect(cols, TABLE, ATTR);
  qry += `FROM  ${SCHEMA}.${TABLE}\n
          INNER JOIN ${san_ident_animal_pred.SCHEMA}.${san_ident_animal_pred.TABLE}
          ON (${TABLE}.${ATTR.IDIDEN[0]} = ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.IDIDEN[0]}
              AND ${TABLE}.${ATTR.SECUENCIAL[0]} = ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.SECUENCIAL[0]}
          )
          INNER JOIN ${san_ident_animal.SCHEMA}.${san_ident_animal.TABLE}
          ON (${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.IDIDEN[0]} = ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.IDIDEN[0]})
          WHERE CONCAT(
            CONCAT(
              ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.CODI_SEDE_SED[0]}, ${san_ident_animal.TABLE}.${san_ident_animal.ATTR.CODI_PROD_PRO[0]}
              ), ${san_ident_animal_pred.TABLE}.${san_ident_animal_pred.ATTR.CODI_PRED_PRE[0]})=TO_NUMBER(:farm_id)`;
  console.log(qry)
  console.log(farm_id)
  try{
      db = await oracle.connect();
      result = await db.execute(qry, [ farm_id ], { outFormat: 4002 });
      console.log(result)
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
    getByID,
    getByFarmID,
    getByEarringID,
    SCHEMA,
    TABLE,
    ATTR
}