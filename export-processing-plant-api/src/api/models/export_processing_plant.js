const oracle = require("../../config/db"),
  logger = require("../utils/logger"),
  utils = require("../utils/utils"),
  plant_sol = require("./export_processing_plant_sol");
  plant_product = require("./export_processing_plant_products");

  function utmToLatLng(zone, easting, northing, northernHemisphere){
        if (!northernHemisphere){
            northing = 10000000 - northing;
        }

        var a = 6378137;
        var e = 0.081819191;
        var e1sq = 0.006739497;
        var k0 = 0.9996;

        var arc = northing / k0;
        var mu = arc / (a * (1 - Math.pow(e, 2) / 4.0 - 3 * Math.pow(e, 4) / 64.0 - 5 * Math.pow(e, 6) / 256.0));

        var ei = (1 - Math.pow((1 - e * e), (1 / 2.0))) / (1 + Math.pow((1 - e * e), (1 / 2.0)));

        var ca = 3 * ei / 2 - 27 * Math.pow(ei, 3) / 32.0;

        var cb = 21 * Math.pow(ei, 2) / 16 - 55 * Math.pow(ei, 4) / 32;
        var cc = 151 * Math.pow(ei, 3) / 96;
        var cd = 1097 * Math.pow(ei, 4) / 512;
        var phi1 = mu + ca * Math.sin(2 * mu) + cb * Math.sin(4 * mu) + cc * Math.sin(6 * mu) + cd * Math.sin(8 * mu);

        var n0 = a / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (1 / 2.0));

        var r0 = a * (1 - e * e) / Math.pow((1 - Math.pow((e * Math.sin(phi1)), 2)), (3 / 2.0));
        var fact1 = n0 * Math.tan(phi1) / r0;

        var _a1 = 500000 - easting;
        var dd0 = _a1 / (n0 * k0);
        var fact2 = dd0 * dd0 / 2;

        var t0 = Math.pow(Math.tan(phi1), 2);
        var Q0 = e1sq * Math.pow(Math.cos(phi1), 2);
        var fact3 = (5 + 3 * t0 + 10 * Q0 - 4 * Q0 * Q0 - 9 * e1sq) * Math.pow(dd0, 4) / 24;

        var fact4 = (61 + 90 * t0 + 298 * Q0 + 45 * t0 * t0 - 252 * e1sq - 3 * Q0 * Q0) * Math.pow(dd0, 6) / 720;

        var lof1 = _a1 / (n0 * k0);
        var lof2 = (1 + 2 * t0 + Q0) * Math.pow(dd0, 3) / 6.0;
        var lof3 = (5 - 2 * Q0 + 28 * t0 - 3 * Math.pow(Q0, 2) + 8 * e1sq + 24 * Math.pow(t0, 2)) * Math.pow(dd0, 5) / 120;
        var _a2 = (lof1 - lof2 + lof3) / Math.cos(phi1);
        var _a3 = _a2 * 180 / Math.PI;

        var latitude = 180 * (phi1 - fact1 * (fact2 + fact3 + fact4)) / Math.PI;

        if (!northernHemisphere){
          latitude = -latitude;
        }

        var longitude = ((zone > 0) && (6 * zone - 183.0) || 3.0) - _a3;

        var obj = {
              latitude : latitude,
              longitude: longitude
        };


        return obj;
      }

const SCHEMA = "FINALBPM",
      TABLE = "PRG_EXP_CERTIFICADO_PLANTA",
      ATTR = {
        ID: ["CODI_CERT_PLA", "id"],
        NUME_CERT_PLA: ["NUME_CERT_PLA", "sequential_id"],
        CODI_SOLI_PLA: ["CODI_SOLI_PLA", "application_id"],
        CODI_PROC_PRO: ["CODI_PROC_PRO", "category"],
        FECH_MODI:     ["FECH_MODI", "fech_modi"],
        FECH_CREA:     ["FECH_CREA", "start_date"],
        CODI_SEDE_SED: ["CODI_SEDE_SED", "hq"],
        NOMB_EMPR_PLA: ["NOMB_EMPR_PLA", "name"],
        LATI_TRAM_TRA: ["LATI_TRAM_TRA", "geo_lat"],
        LONG_TRAM_TRA: ["LONG_TRAM_TRA", "geo_long"],
        ZONA:          ["ZONA", "zone"],
        ESTADO:        ["ESTADO", "state"]
      };

const AUX_EXPORTER = "PLANT",
      ATTR_EXPORTER = {
        CODI_CERT_PLA:    ['"id"'        , "id"],
        NUME_CERT_PLA:    ['"sequential_id"'        , "sequential_id"],
        CODI_SOLI_PLA:    ['"application_id"'        , "application_id"],
        CODI_PROC_PRO:    ['"category"'         , "category"],
        FECH_MODI:        ['"fech_modi"'            , "fech_modi"],
        FECH_CREA:        ['"start_date"'            , "start_date"],
        CODI_SEDE_SED:    ['"hq"'        , "hq"],
        NOMB_EMPR_PLA:    ['"name"'        , "name"],
        LATI_TRAM_TRA:    ['"geo_lat"'        , "geo_lat"],
        LONG_TRAM_TRA:    ['"geo_long"'        , "geo_long"],
        ZONA:             ['"zone"'                 , "zone"],
        ESTADO:           ['"state"'              , "state"],
        NOMBRES:          ['"contact_person"'     , 'contact_person'],
        DNI:              ['"persona_dni"'        , 'contact_person_dni'],
        YEAR:             ['"year"'               , 'year'],
        DIRECCION:        ['"address_real"'       , 'address_real'],
        DEPARTAMENTO_ID:  ['"department"'         , 'department'],
        PROVINCIA_ID:     ['"province"'           , 'province'],
        DISTRITO_ID:      ['"district"'           , 'district'],
        CCODEXP:          ['"file_id"'            , "file_id"]
      };

const getByID = async (id, cols) => {
  let result, result2, qry, qry2, db;
  qry = `SELECT 'export-processing-plant' AS "type",`;
  qry += `CASE WHEN ${AUX_EXPORTER}."state" NOT IN ('SUSPENDIDO','CANCELADO') THEN 1 ELSE 0 END AS "is_active",`;
  qry += `NULL AS "products",`;
  qry += `CASE
  WHEN PLANT."category" = '301' THEN 'Centro de inspección' 
  WHEN PLANT."category" = '302' THEN 'Planta de empaque' 
  WHEN PLANT."category" = '303' THEN 'Planta de tratamiento' 
  WHEN PLANT."category" = '304' THEN 'Planta de tratamiento y empaque' 
  WHEN PLANT."category" = '305' THEN 'Embalaje de madera' 
  ELSE 'Tipo no reconocido' END AS "category",`;
  qry += await utils.makeSelect(cols, AUX_EXPORTER, ATTR_EXPORTER);
  qry += `FROM ( `;
  qry += await getSelectExportProcessingPlant(cols);
  qry += `) ${AUX_EXPORTER} `;
  qry += `WHERE ${AUX_EXPORTER}."id"=:id`;

  qry2 = `SELECT pecpe.${ATTR.ID [0]} AS "plant_id", producto.CODIGO_PARTIDA_ARANCELARIA as "export_code", producto.NOMBRE_COMERCIAL_PRODUCTO as "name", producto.NOMBRE_CIENTIFICO_PRODUCTO AS "scientific_name", pecpe.ESTADO AS "product_state" `;
  qry2 += `FROM  ${plant_product.SCHEMA}.${plant_product.TABLE} pecpe LEFT JOIN Finalbpm.producto ON pecpe.CODIGO_ESPECIE = producto.CODIGO_ESPECIE AND pecpe.CODIGO_PRODUCTO=producto.CODIGO_PRODUCTO `;
  qry2 += `WHERE pecpe.${ATTR.ID [0]}=:id`;
  console.log(qry2)

  try {
    db = await oracle.connect();
    result = await db.execute(qry, [id], { outFormat: 4002 });
    result2 = await db.execute(qry2, [id], { outFormat: 4002 });
    result.rows.forEach(v => {
      let plant_products = result2.rows.filter(v2 => v2['plant_id'] === v['id']);
      if (plant_products) {
          v['products'] = plant_products;
      } else {
          v['products'] = null;
      }
  })
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

const getSelectExportProcessingPlant = async(cols) => {
  let qry;
  qry = `SELECT  `;
  qry += `CAST(EXTRACT(YEAR FROM ${TABLE}.${ATTR.FECH_CREA[0]}) AS CHAR(4)) AS "year", `;
  qry += await utils.makeSelect(cols, TABLE, ATTR) + ', ' ;
  qry += await utils.makeSelect(cols, plant_sol.TABLE, plant_sol.ATTR);
  qry += `FROM  ${SCHEMA}.${TABLE} `
  qry += ` LEFT JOIN ${plant_sol.SCHEMA}.${plant_sol.TABLE} ON ${TABLE}.${ATTR.CODI_SOLI_PLA[0]}=${plant_sol.TABLE}.${ATTR.CODI_SOLI_PLA[0]}
          `
  return qry;
}

module.exports = {
  getByID,
  SCHEMA,
  TABLE,
  ATTR,
};
