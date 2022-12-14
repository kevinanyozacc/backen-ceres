const oracle = require("../../config/db"),
  logger = require("../utils/logger"),
  utils = require("../utils/utils"),
  persona = require("./persona");


const SCHEMA = "FINALBPM",
      TABLE = "INFORME_INSPECCION_VERIFICACIO",
      ATTR = {
        ID: ["PERSONA_ID", "id"],
      };

const AUX_EXPORTER = "EXPORTER",
      ATTR_EXPORTER = {
        ESTADO:           ['"is_active"'          , "is_active"],
        NAME:             ['"name"'               , "name"],
        RUC:              ['"ruc"'                , 'ruc'],
        DIRECCION:        ['"address_legal"'      , 'address_legal'],
        NOMBRES:          ['"contact_person_name"', 'contact_person'],
        TELEFONO:         ['"phone"'              , 'contact_person_phone'],
        TELEFONO_MOVIL:   ['"mobile_phone"'       , 'contact_person_mobile_phone'],
        DNI:              ['"persona_dni"'        , 'contact_person_dni'],
        DEPARTAMENTO_ID:  ['"department"'         , 'department'],
        PROVINCIA_ID:     ['"province"'           , 'province'],
        DISTRITO_ID:      ['"district"'           , 'district'],
        FECH_CREA:        ['"start_date"'         , 'start_date'],
        FECH_MODI:        ['"fech_modi"'          , 'fech_modi'],
        YEAR:             ['"year"'               , 'year']
      };

const getByID = async (id, cols) => {
  let result, qry, db;
  qry = `SELECT 'agricultural-exporter' AS "type",`;
  qry += `${AUX_EXPORTER}."id",`;
  qry += await utils.makeSelect(cols, AUX_EXPORTER, ATTR_EXPORTER);
  qry += `FROM ( `;
  qry += await getSelectExporter(cols);
  qry += `) ${AUX_EXPORTER} `;
  qry += `WHERE ${AUX_EXPORTER}."id"=:id`;
  console.log(qry)
  try {
    db = await oracle.connect();
    result = await db.execute(qry, [id], { outFormat: 4002 });
  } catch (err) {
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
};

const getSelectExporter = async(cols) => {
  let qry;
  qry = `SELECT  `;
  qry += `${persona.TABLE}.${ATTR.ID[0]} AS "id", `;
  qry += `CAST(EXTRACT(YEAR FROM ${persona.TABLE}.${persona.ATTR.FECH_CREA[0]}) AS CHAR(4)) AS "year", `;
  qry += `${persona.TABLE}.${persona.ATTR.NOMBRES[0]} || ${persona.TABLE}.${persona.ATTR.APELLIDO_PATERNO[0]} || ${persona.TABLE}.${persona.ATTR.APELLIDO_MATERNO[0]} AS "contact_person_name", `;
  qry += `CASE WHEN ${persona.TABLE}.${persona.ATTR.DOCUMENTO_TIPO[0]} = '01' THEN ${persona.TABLE}.${persona.ATTR.DOCUMENTO_NUMERO[0]} ELSE NULL END AS "contact_person_dni", `;
  qry += `CASE WHEN ${persona.TABLE}.${persona.ATTR.DOCUMENTO_TIPO[0]} = '04' THEN ${persona.TABLE}.${persona.ATTR.DOCUMENTO_NUMERO[0]} ELSE PERSONA.RUC END AS "ruc", `;
  qry += await utils.makeSelect(cols, persona.TABLE, persona.ATTR) ;
  qry += `FROM  (`
  qry +=  `SELECT ${TABLE}.${ATTR.ID[0]} `;
  qry += `FROM ${SCHEMA}.${TABLE} 
          GROUP BY ${TABLE}.${ATTR.ID[0]} 
          ) A LEFT JOIN ${persona.SCHEMA}.${persona.TABLE} ON A.${ATTR.ID[0]}=${persona.TABLE}.${ATTR.ID[0]}
          `
  return qry;
}

module.exports = {
  getByID,
  SCHEMA,
  TABLE,
  ATTR,
};
