const oracle = require('../../config/db'),
      logger = require('../utils/logger'),
      utils  = require('../utils/utils');

const SCHEMA = "FINALBPM",
      TABLE = "INFORME_INSPECCION_VERIFICACIO",
      ATTR = {
        PERSONA_ID: ["PERSONA_ID", "exporter_id"],
        CODIGO_IIV: ["CODIGO_IIV", "certificate_id"],
        ESTADO: 		["ESTADO", "certificate_state"],
        CODIGO_EXPEDIENTE: 		["CODIGO_EXPEDIENTE", "file_id"],
        CODIGO_LI: 		["CODIGO_LUGAR_INSPECCION", "inspection_place"],
        IMPORTADOR: 		["NOM_RAZSOC_IMPORTADOR", "importer"],
        PAIS_DESTINO: 		["PAIS_DEST_ENVIO", "destination"],
        VIA_SALIDA: 		["MED_TRANS_ENVIO", "transportation_mode"],
        PUERTO: 		["PUEST_CONT_SALI_ENVIO", "checkpoint"],
        PLANTA: 		["COD_INSTALACION", "code_plant"],
        FECHA_INSPECCION: ["FECH_INSP_ENVIO", "inspection_date"],
        FECHA_EMBARQUE: 		["FECH_EMBA_ENVIO", "export_date"],
      };

const getCertificates = async (company_id, cols) => {
    let result, result2, qry, qry2, db;
    
    qry  = `SELECT 'export-certificate' AS "type", `; 
    qry  += `CERT.CODI_CERT_PLA AS "plant_id", `; 
		// Agregar productos
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  ${SCHEMA}.${TABLE}  LEFT JOIN FINALBPM.PRG_EXP_CERTIFICADO_PLANTA CERT
		ON UPPER(INFORME_INSPECCION_VERIFICACIO.COD_INSTALACION) =
																		CERT.CODI_SEDE_SED
																 || '-'
																 || CERT.NUME_CERT_PLA
																 || '-'
																 || CASE
																			 WHEN CERT.CODI_PROC_PRO = '301' THEN 'CI'
																			 WHEN CERT.CODI_PROC_PRO = '302' THEN 'PE'
																			 WHEN CERT.CODI_PROC_PRO = '303' THEN 'PT'
																			 WHEN CERT.CODI_PROC_PRO = '304' THEN 'PTE'
	                                    WHEN CERT.CODI_PROC_PRO = '305' THEN 'EM'
																		END `;
    qry += `WHERE ${TABLE}.${ATTR.PERSONA_ID[0]} =:company_id AND ${TABLE}.${ATTR.FECHA_INSPECCION[0]} >= (TRUNC(SYSDATE) - 450) `;
    
		qry2 = `SELECT 
			${TABLE}.${ATTR.CODIGO_IIV[0]} AS "certificate_id",
			producto.CODIGO_PARTIDA_ARANCELARIA as "export_code", 
			producto.NOMBRE_COMERCIAL_PRODUCTO as "name",
			producto.NOMBRE_CIENTIFICO_PRODUCTO AS "scientific_name",
			REGEXP_REPLACE(UPPER(INFO_INSP_VERI_LP_PROD.COD_LP_PROD), '\\s|\-','') AS "farm_id"
		FROM  ${SCHEMA}.${TABLE} 
		LEFT JOIN ${SCHEMA}.INFO_INSP_VERI_LP_PROD ON ${TABLE}.${ATTR.CODIGO_IIV[0]}= INFO_INSP_VERI_LP_PROD.${ATTR.CODIGO_IIV[0]} 
		LEFT JOIN Finalbpm.producto ON INFO_INSP_VERI_LP_PROD.CODIGO_PRODUCTO =producto.CODIGO_PRODUCTO 
		`;
		qry2 += `WHERE ${TABLE}.${ATTR.PERSONA_ID[0]} =:company_id AND ${TABLE}.${ATTR.FECHA_INSPECCION[0]} >= (TRUNC(SYSDATE) - 450) `;
    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ company_id ], { outFormat: 4002 });
        result2 = await db.execute(qry2, [ company_id ], { outFormat: 4002 });
        result.rows.map(v => v['products'] = result2.rows.filter(v2 => v2['certificate_id'] === v['certificate_id']));
    }catch(err){
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

const getCertificatesByFarmID = async (farm_id, cols) => {
  let result, result2, qry, qry2, db;
  // buscar certificados de lugar de produccion asociados a un predio
  let qry_aux = `
  SELECT INFO_INSP_VERI_LP_PROD.${ATTR.CODIGO_IIV[0]}
  FROM  ${SCHEMA}.INFO_INSP_VERI_LP_PROD
  WHERE REGEXP_REPLACE(UPPER(INFO_INSP_VERI_LP_PROD.COD_LP_PROD), '\\s|\-','')  =:farm_id
  GROUP BY INFO_INSP_VERI_LP_PROD.${ATTR.CODIGO_IIV[0]}
  `
  // buscar certificados de exportacion asociados a los certificados de lugar de produccion
  qry  = `SELECT 'export-certificate' AS "type", `; 
    qry  += `CERT.CODI_CERT_PLA AS "plant_id", `; 
    qry += await utils.makeSelect(cols, TABLE, ATTR);
    qry += `FROM  (${qry_aux}) CERT_FARM LEFT JOIN ${SCHEMA}.${TABLE} 
    ON CERT_FARM.${ATTR.CODIGO_IIV[0]}=${TABLE}.${ATTR.CODIGO_IIV[0]} 
    LEFT JOIN FINALBPM.PRG_EXP_CERTIFICADO_PLANTA CERT
		ON UPPER(INFORME_INSPECCION_VERIFICACIO.COD_INSTALACION) =
																		CERT.CODI_SEDE_SED
																 || '-'
																 || CERT.NUME_CERT_PLA
																 || '-'
																 || CASE
																			 WHEN CERT.CODI_PROC_PRO = '301' THEN 'CI'
																			 WHEN CERT.CODI_PROC_PRO = '302' THEN 'PE'
																			 WHEN CERT.CODI_PROC_PRO = '303' THEN 'PT'
																			 WHEN CERT.CODI_PROC_PRO = '304' THEN 'PTE'
	                                    WHEN CERT.CODI_PROC_PRO = '305' THEN 'EM'
																		END `;
    qry += `WHERE ${TABLE}.${ATTR.FECHA_INSPECCION[0]} >= (TRUNC(SYSDATE) - 728) `;
    
    // obtener tabla con lista de distintos productos por certificado y predio
    let qry2_aux = `
    SELECT INFO_INSP_VERI_LP_PROD.${ATTR.CODIGO_IIV[0]},
    INFO_INSP_VERI_LP_PROD.CODIGO_PRODUCTO,
    INFO_INSP_VERI_LP_PROD.COD_LP_PROD
    FROM  ${SCHEMA}.INFO_INSP_VERI_LP_PROD
    WHERE REGEXP_REPLACE(UPPER(INFO_INSP_VERI_LP_PROD.COD_LP_PROD), '\\s|\-','')  =:farm_id
    GROUP BY INFO_INSP_VERI_LP_PROD.${ATTR.CODIGO_IIV[0]}, INFO_INSP_VERI_LP_PROD.COD_LP_PROD,  INFO_INSP_VERI_LP_PROD.CODIGO_PRODUCTO
    `
    // obtener información del producto del certificado de exportacion solo de este predio
    qry2 = `SELECT 
      CERT_FARM.${ATTR.CODIGO_IIV[0]} AS "certificate_id",
			producto.CODIGO_PARTIDA_ARANCELARIA as "export_code", 
			producto.NOMBRE_COMERCIAL_PRODUCTO as "name",
			producto.NOMBRE_CIENTIFICO_PRODUCTO AS "scientific_name"
		FROM  (${qry2_aux}) CERT_FARM 
				LEFT JOIN Finalbpm.producto ON CERT_FARM.CODIGO_PRODUCTO =producto.CODIGO_PRODUCTO 
		`;
		qry2 += `WHERE REGEXP_REPLACE(UPPER(CERT_FARM.COD_LP_PROD), '\\s|\-','')=:farm_id  `;

  try{
      db = await oracle.connect();
      result = await db.execute(qry, [ farm_id ], { outFormat: 4002 });
      result2 = await db.execute(qry2, [ farm_id ], { outFormat: 4002 });
      result.rows.map(v => v['products'] = result2.rows.filter(v2 => v2['certificate_id'] === v['certificate_id']));
  console.log(result);
      
  }catch(err){
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

const getCertificatesByPlantID = async (plant_id, cols) => {
  let result, result2, qry, qry2, db;
  // Busca los certificados de exportacion relacionados a una planta
  qry  = `SELECT 'export-certificate' AS "type", `; 
  qry  += `CERT.CODI_CERT_PLA AS "plant_id", `; 
  qry += await utils.makeSelect(cols, TABLE, ATTR);
  qry += `FROM  ${SCHEMA}.${TABLE}  LEFT JOIN FINALBPM.PRG_EXP_CERTIFICADO_PLANTA CERT
  ON UPPER(INFORME_INSPECCION_VERIFICACIO.COD_INSTALACION) =
                                  CERT.CODI_SEDE_SED
                               || '-'
                               || CERT.NUME_CERT_PLA
                               || '-'
                               || CASE
                                     WHEN CERT.CODI_PROC_PRO = '301' THEN 'CI'
                                     WHEN CERT.CODI_PROC_PRO = '302' THEN 'PE'
                                     WHEN CERT.CODI_PROC_PRO = '303' THEN 'PT'
                                     WHEN CERT.CODI_PROC_PRO = '304' THEN 'PTE'
                                    WHEN CERT.CODI_PROC_PRO = '305' THEN 'EM'
                                  END `;
  qry += `WHERE CERT.CODI_CERT_PLA =:plant_id AND ${TABLE}.${ATTR.FECHA_INSPECCION[0]} >= (TRUNC(SYSDATE) - 450) `;
  // Busca los productos de los certificados de qry
  qry2 = `SELECT 
    ${TABLE}.${ATTR.CODIGO_IIV[0]} AS "certificate_id",
    producto.CODIGO_PARTIDA_ARANCELARIA as "export_code", 
    producto.NOMBRE_COMERCIAL_PRODUCTO as "name",
    producto.NOMBRE_CIENTIFICO_PRODUCTO AS "scientific_name",
    REGEXP_REPLACE(UPPER(INFO_INSP_VERI_LP_PROD.COD_LP_PROD), '\\s|\-','') AS "farm_id"
  FROM  ${SCHEMA}.${TABLE} LEFT JOIN FINALBPM.PRG_EXP_CERTIFICADO_PLANTA CERT
  ON UPPER(INFORME_INSPECCION_VERIFICACIO.COD_INSTALACION) =
                                  CERT.CODI_SEDE_SED
                               || '-'
                               || CERT.NUME_CERT_PLA
                               || '-'
                               || CASE
                                     WHEN CERT.CODI_PROC_PRO = '301' THEN 'CI'
                                     WHEN CERT.CODI_PROC_PRO = '302' THEN 'PE'
                                     WHEN CERT.CODI_PROC_PRO = '303' THEN 'PT'
                                     WHEN CERT.CODI_PROC_PRO = '304' THEN 'PTE'
                                    WHEN CERT.CODI_PROC_PRO = '305' THEN 'EM'
                                  END 
  LEFT JOIN ${SCHEMA}.INFO_INSP_VERI_LP_PROD ON ${TABLE}.${ATTR.CODIGO_IIV[0]}= INFO_INSP_VERI_LP_PROD.${ATTR.CODIGO_IIV[0]} 
  LEFT JOIN Finalbpm.producto ON INFO_INSP_VERI_LP_PROD.CODIGO_PRODUCTO =producto.CODIGO_PRODUCTO 
  `;
  qry2 += `WHERE CERT.CODI_CERT_PLA =:plant_id AND ${TABLE}.${ATTR.FECHA_INSPECCION[0]} >= (TRUNC(SYSDATE) - 450) `;
  
  try{
      db = await oracle.connect();
      result = await db.execute(qry, [ plant_id ], { outFormat: 4002 });
      result2 = await db.execute(qry2, [ plant_id ], { outFormat: 4002 });
      result.rows.map(v => v['products'] = result2.rows.filter(v2 => v2['certificate_id'] === v['certificate_id']));
      result.rows = result.rows.slice(0, 100)
      
  }catch(err){
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
		getCertificates,
    getCertificatesByFarmID,
    getCertificatesByPlantID,
    SCHEMA,
    TABLE,
    ATTR
}
