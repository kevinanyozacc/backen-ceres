const oracle                = require('../../config/db'),
      logger                = require('../utils/logger'),
      utils                 = require('../utils/utils');
      
const TABLE_EVENT='EVENT',
      ATTR_EVENT={
        TYPE_:               ['type'                , 'type'],
        DATE:                ['start_date'          , 'start_date'],
        USUARIO_ID:          ['user_id'             , 'user_id'],
        USUARIO_NOMBRE:      ['user_name'           , 'user_name'],
        TIPO_ESTABLECIMIENTO:['company_type'        , 'company_type'],
        COD_ESTABLECIMIENTO: ['company_id'          , 'company_id'],
        CODI_DEPA_ORI:       ['department_origin'   , 'department_origin'],
        CODI_PROV_ORI:       ['province_origin'     , 'province_origin'],
        CODI_DIST_ORI:       ['district_origin'     , 'district_origin'],
        HQ:                  ['hq'                  , 'hq'],
        GEO_LAT:             ['geo_lat'             , 'geo_lat'],
        GEO_LONG:            ['geo_long'            , 'geo_long'],
        COMENTARIO:          ['comment'             , 'comment'],
        TIPO_ESTABLECIMIENTO:['company_type_destination', 'company_type_destination'],
        COD_ESTABLECIMIENTO: ['company_id_destination'  , 'company_id_destination'],
        CODI_DEPA_DES:       ['department_destination'  , 'department_destination'],
        CODI_PROV_DES:       ['province_destination'    , 'province_destination'],
        CODI_DIST_DES:       ['district_destination'    , 'district_destination'],
      };


const SCHEMA='SIGSA',
      TABLE_CSTI='DEFENSA_TRANSITO',
      ATTR_CSTI={
        NUME_CSTI_TRA:       ['NUME_CSTI_TRA'       , 'csti_id'],
        CODI_CBEN_CBE:       ['CODI_CBEN_CBE'       , 'company_id_destination'],
        FECH_CSTI_TRA:       ['FECH_CSTI_TRA'       , 'start_date'],
        NOMB_RESP_CER:       ['NOMB_RESP_CER'       , 'user_name'],
        CODI_DEPA_ORI:       ['CODI_DEPA_ORI'       , 'department_origin'],
        CODI_PROV_ORI:       ['CODI_PROV_ORI'       , 'province_origin'],
        CODI_DIST_ORI:       ['CODI_DIST_ORI'       , 'district_origin'],
        CODI_SEDE_SED:       ['CODI_SEDE_SED'       , 'hq'],
        CODI_DEPA_DES:       ['CODI_DEPA_DES'       , 'department_destination'],
        CODI_PROV_DES:       ['CODI_PROV_DES'       , 'province_destination'],
        CODI_DIST_DES:       ['CODI_DIST_DES'       , 'district_destination'],
        FLAG_PROP_TRA:       ['FLAG_PROP_TRA'       , 'purpose'],
      };

const SCHEMA_EARRING_READING='SIGIA',
      TABLE_EARRING_READING='ARETE_TRAZABILIDAD',
      ATTR_EARRING_READING={
        COD_ARETE:              ['COD_ARETE'           , 'animal_id'],
        TIPO_REGISTRO:          ['TIPO_REGISTRO'       , 'type'],
        TIPO_ESTABLECIMIENTO:   ['TIPO_ESTABLECIMIENTO', 'company_type'],
        COD_ESTABLECIMIENTO:    ['COD_ESTABLECIMIENTO' , 'company_id'],
        FECH_CREA:              ['FECH_CREA'           , 'start_date'],
        LAT:                    ['LAT'                 , 'geo_lat'],
        LONG:                   ['"LONG"'              , 'geo_long'],
        COMENTARIO:             ['COMENTARIO'          , 'comment'],        
        DIRECCION_EJECUTIVA:    ['DIRECCION_EJECUTIVA' , 'hq'],
        USUARIO_ID:             ['USUARIO_ID'          , 'user_id'],
        USUARIO_NOMBRE:         ['USUARIO_NOMBRE'      , 'user_name'],
      };

const getCSTIByID = async (id, cols) => {
    let result, db, qry, qry2;
    let result2;
    // Obtiene los csti de los últimos 30 días
    qry  = `SELECT 'csti' AS "type", `;
    qry += `NULL AS "user_id", `;
    qry += `NULL AS "geo_lat", `;
    qry += `NULL AS "geo_long", `;
    qry += `'Matadero' AS "company_type_destination", `;
    qry += `NUME_DOCU_DNI AS "contact_person_dni", `;
    qry += `TIPO_RESP_CER AS "contact_person_type", `;
    qry += `${TABLE_CSTI}.${ATTR_CSTI.NUME_CSTI_TRA[0]} AS "csti_id", `;
    qry += `'Motivo: ' || TO_CHAR(${TABLE_CSTI}.${ATTR_CSTI.FLAG_PROP_TRA[0]}) || '- Código CSTI: ' || TO_CHAR(${TABLE_CSTI}.${ATTR_CSTI.NUME_CSTI_TRA[0]}) AS "comment", `;
    qry += await utils.makeSelect(cols, TABLE_CSTI, ATTR_CSTI);
    qry += `FROM  (SELECT NUME_CSTI_TRA
        FROM SIGSA.DEFENSA_TRANSITO_ANIMAL 
        WHERE IDENTIFICACION_INDIVIDUAL =:id ) c LEFT JOIN ${SCHEMA}.${TABLE_CSTI} ON c.NUME_CSTI_TRA =  ${TABLE_CSTI}.${ATTR_CSTI.NUME_CSTI_TRA[0]}`;

    // Obtiene el predio de origen de aquellos productores que tienen solo una correspondencia
    qry2 = `SELECT X."csti_id", 
            CONCAT(CONCAT(PATRON_PRODUCTORES.CODI_SEDE_SED, PATRON_PRODUCTORES.CODI_PROD_MOS), MAX(PREDIOS.CODI_PRED_MOS)) AS farm_id,
            PATRON_PRODUCTORES.CODI_SEDE_SED, 
            PATRON_PRODUCTORES.CODI_PROD_MOS, 
            PATRON_PRODUCTORES.NOMB_PROD_MOS 
            FROM (
              SELECT recycle."csti_id", recycle."contact_person_dni" 
              FROM (${qry}) recycle 
              WHERE recycle."contact_person_type" = 'P' AND recycle."contact_person_dni" IS NOT NULL) X  
              LEFT JOIN SIIMF.PATRON_PRODUCTORES ON X."contact_person_dni" = PATRON_PRODUCTORES.IDEN_PROD_MOS 
              LEFT JOIN SIIMF.PREDIOS ON PATRON_PRODUCTORES.CODI_PROD_MOS = PREDIOS.CODI_PROD_MOS AND PATRON_PRODUCTORES.CODI_SEDE_SED = PREDIOS.CODI_SEDE_SED
            WHERE PATRON_PRODUCTORES.ESTA_REGI_PRD = 'A' 
            GROUP BY X."csti_id", PATRON_PRODUCTORES.CODI_SEDE_SED, PATRON_PRODUCTORES.CODI_PROD_MOS,PATRON_PRODUCTORES.NOMB_PROD_MOS 
            HAVING COUNT(*) = 1`;

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        result2 = await db.execute(qry2, [ id ], { outFormat: 4002 });
        // Agrega info de predio de origen si es que hay uno relacionado al csti
        result.rows.forEach(v => {
            let farm = result2.rows.find(v2 => v2['csti_id'] === v['csti_id']);
            if (farm) {
                v['company_type'] = 'farm';
                v['company_id'] = farm['farm_id'];
            } else {
                v['company_type'] = null;
                v['company_id'] = null;
            }
        })
        // Agrega info de matadero de destino si es que hay uno relacionado al csti 
        result.rows.forEach(v => {
            if (v['company_id_destination'] === null) {
                v['company_type_destination'] = null;
                v['company_id_destination'] = null;
            } 
        })
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


const getEarringReadingByID = async (id, cols) => {
    let result, db, qry;
    // Obtiene los registros de la tabla ARETE_TRAZABILIDAD por código de identificacion animal
    qry  = `SELECT `;
    qry += `NULL AS "department_origin", `;
    qry += `NULL AS "province_origin", `;
    qry += `NULL AS "district_origin", `;
    qry += `NULL AS "company_type_destination", `;
    qry += `NULL AS "company_id_destination", `;
    qry += `NULL AS "department_destination", `;
    qry += `NULL AS "province_destination", `;
    qry += `NULL AS "district_destination", `;
    qry += await utils.makeSelect(cols, TABLE_EARRING_READING, ATTR_EARRING_READING);
    qry += `FROM  ${SCHEMA_EARRING_READING}.${TABLE_EARRING_READING} `;
    qry += `WHERE  ${TABLE_EARRING_READING}.${ATTR_EARRING_READING.COD_ARETE[0]}=:id`;
    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
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


const getEventsByID = async (id, cols) => {
    let result_csti = await getCSTIByID(id, cols);
    let result_earring_readings = await getEarringReadingByID(id, cols);
    result_csti.rows = result_csti.rows.concat(result_earring_readings.rows).sort((a, b) => a.start_date - b.start_date)
    return result_csti;
}

const insert = async (data) => {
    let qry, db, result;
    if (data['type_company'] === undefined) data['type_company'] = 'No informado'
    if (data['cod_company'] === undefined) data['cod_company'] = 'No informado'

    const other_columns = ['comment', 'hq', 'user_id', 'user_name']
    other_columns.forEach(v => {
        if (data[v] === undefined) { data[v] = null } })
    
    qry = `INSERT INTO ${SCHEMA_EARRING_READING}.${TABLE_EARRING_READING} (
        COD_ARETE,
        TIPO_REGISTRO,
        LAT,
        "LONG",
        COMENTARIO,
        COD_ESTABLECIMIENTO,
        TIPO_ESTABLECIMIENTO,
        DIRECCION_EJECUTIVA,
        USUARIO_ID,
        USUARIO_NOMBRE
    ) VALUES (
        \'${data.earring_id}\',
        'Lectura de arete',
        ${data.lat},
        ${data.long},
        \'${data.comment}\',
        \'${data.cod_company}\',
        \'${data.type_company}\',
        \'${data.hq}\',
        \'${data.user_id}\',
        \'${data.user_name}\'
    )`;
    try{
        db = await oracle.connect();
        await db.execute(qry, [], { autoCommit: true });
        result = true
    } catch(err){
        result = false
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
	getEventsByID,
    getCSTIByID,
    getEarringReadingByID,
    insert
}
