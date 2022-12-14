const oracle = require('../../config/db'),
      logger = require('../utils/logger');


const get = async () => {
    let result, db, qry;
    qry  = `SELECT C.stat, C.n\n
    FROM ( SELECT 'animales_registrados' AS stat, COUNT(*) AS n\n
    FROM SIGIA.SAN_INDET_ANIMAL_DETALLE \n
    UNION ALL \n
    SELECT 'productores_registrados' AS stat , COUNT(*) AS n \n
    FROM SIIMF.PATRON_PRODUCTORES \n
    WHERE ESTA_REGI_PRD = 'A' \n
    UNION ALL \n
    SELECT 'empresas_registradas' AS stat, COUNT(*) AS n \n
    FROM VIEW_COMPANIES) C`;

    console.log(qry);

    try{
        db = await oracle.connect();
        result = await db.execute(qry,[], { outFormat: 4002 });
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
}
