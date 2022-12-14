const oracle = require("../../config/db"),
  orcl = require("oracledb"),
  bcrypt = require("bcrypt"),
  logger = require("../utils/logger");

const SCHEMA = "SEGURIDAD";

const auth = async (user, pass) => {
  let qry, db, r;
  const result = {
    ldap: "",
    user: "",
    role: "",
    hq: "",
    name: "",
    is_admin: "",
  };

  const tmp_data = {
    credentials: "",
    out: "",
  };

  const data = {
    credentials: `${user}$$<->$$${pass}`,
    out: { dir: orcl.BIND_OUT, type: orcl.CURSOR },
  };

  const binds = Object.assign({}, tmp_data, data);

  qry = `BEGIN SEGURIDAD.PKG_WEBSEGURIDAD.LOGIN(:credentials, :out); END;`;

  try {
    db = await oracle.connect();
    r = await db.execute(qry, binds, { outFormat: 4002 });
    const resultSet = r.outBinds.out;
    let row;
    while ((row = await resultSet.getRow())) {
      result.ldap = row.LDAP;
      result.user = row.IDUSER;
    }
    await resultSet.close();
  } catch (err) {
    logger.error(err);
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  /*
    qry = `SELECT codi_sede_sed,
                  persona_id,
                  name,
                  use_rol,
                  is_admin
            FROM  SEGURIDAD.VW_SEG_USUARIO_EXT
            WHERE flag_acti_usu = 'A'
            AND UPPER(codi_usua_usu)=UPPER(:value)`;
    */
  qry = `SELECT     su.codi_usua_usu AS "codi_usua_usu",
                      CASE WHEN mp.codi_empl_per IS NULL THEN p.DEPARTAMENTO_ID ELSE mp.codi_depa_dpt END AS "codi_depa_dpt",
                      CASE WHEN mp.codi_empl_per IS NULL THEN p.PROVINCIA_ID ELSE mp.codi_prov_tpr END AS "codi_prov_tpr",
                      CASE WHEN mp.codi_empl_per IS NULL THEN p.DISTRITO_ID ELSE mp.codi_dist_tdi END AS "codi_dist_tdi",
                      mp.sede_remu_per AS "codi_sede_sed",
                      si.desc_sede_sed AS "desc_sede_sed",
                      p.persona_id AS "persona_id",
                      CASE WHEN mp.codi_empl_per IS NULL THEN p.NOMBRES ELSE mp.NOM_EMP_PER || ' ' || mp.APE_PAT_PER || ' ' || mp.APE_MAT_PER END AS "name",
                      mp.NOM_EMP_PER AS "nom_emp_per",
                      mp.APE_PAT_PER AS "ape_pat_per",
                      mp.APE_MAT_PER AS "ape_mat_per",
                      su.codi_empl_per AS "codi_empl_per",
                      CASE WHEN p.RUC IS NOT NULL THEN p.RUC WHEN p.DOCUMENTO_TIPO = '01' THEN p.DOCUMENTO_NUMERO ELSE NULL END AS "ruc",
                      CASE WHEN p.DOCUMENTO_TIPO = '01' THEN p.DOCUMENTO_NUMERO END AS "dni",
                      x.email AS "email",
                      CASE WHEN mp.codi_empl_per IS NULL THEN 'USER_EXT' ELSE 'SENASA' END AS "use_rol",
                      CASE WHEN x.status = '3' THEN 1 ELSE 0 END AS "is_admin",
                      CASE WHEN x.USER_ID IS NOT NULL THEN 1 ELSE 0 END AS "is_in_trazabilidad",
                      su.flag_acti_usu AS "flag_acti_usu"
            FROM      SEGURIDAD.seg_usuario su
            LEFT JOIN SIGA.maestro_personal mp          ON mp.codi_empl_per = su.codi_empl_per
            LEFT JOIN SISTEMAS.PERSONA p                ON su.persona_id = p.persona_id
            LEFT JOIN SEGURIDAD.USUARIOS_TRAZABILIDAD x ON x.codi_usua_usu = su.codi_usua_usu
            LEFT JOIN SIGA.sedes_inei si                ON si.codi_sede_sed = mp.sede_remu_per
            WHERE     su.flag_acti_usu='A'
            AND       UPPER(su.codi_usua_usu)=UPPER(:value)`;

  try {
    db = await oracle.connect();
    r = await db.execute(qry, [result.user], { outFormat: 4002 });
    result.hq = r.rows[0].codi_sede_sed;
    result.name = r.rows[0].name;
    result.role = r.rows[0].use_rol;
    result.is_admin = r.rows[0].is_admin;
  } catch (err) {
    logger.error(err);
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  return result;
};

const getUsersTraceability = async (attr, value) => {
  let result, qry;

  qry = `SELECT
                  USER_ID AS "id",
                  DNI AS "dni",
                  FIRSTNAME AS "firstname",
                  LASTNAME AS "lastname",
                  EMAIL AS "email",
                  CODI_USUA_USU AS "username",
                  CREATION_DATE AS "creation_date",
                  FECH_MODI AS "modification_date"
           FROM SEGURIDAD.USUARIOS_TRAZABILIDAD WHERE 1=1 `;

  switch (attr) {
    case "id":
      qry += `AND UPPER(USER_ID)=UPPER(:value)`;
      break;
    case "email":
      qry += `AND UPPER(EMAIL)=UPPER(:value)`;
      break;
    case "status":
      qry += `AND STATUS=:value`;
      break;
    case "username":
      qry += `AND UPPER(CODI_USUA_USU)=UPPER(:value)`;
      break;
    case "dni":
      qry += `AND UPPER(DNI)=UPPER(:value)`;
      break;
    default:
      return result;
  }

  try {
    db = await oracle.connect();
    result = await db.execute(qry, [value], { outFormat: 4002 });
  } catch (err) {
    logger.error(err);
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  return result;
};

const get = async (attr, value) => {
  let result, qry, db;

  /*
    qry = `SELECT codi_usua_usu,
                  codi_depa_dpt,
                  codi_prov_tpr,
                  codi_dist_tdi,
                  codi_sede_sed,
                  desc_sede_sed,
                  persona_id,
                  name,
                  nom_emp_per,
                  ape_pat_per,
                  ape_mat_per,
                  codi_empl_per,
                  ruc,
                  dni,
                  email,
                  use_rol,
                  is_admin,
                  is_in_trazabilidad
            FROM  SEGURIDAD.VW_SEG_USUARIO_EXT
            WHERE flag_acti_usu = 'A' `;
*/

  qry = `SELECT su.codi_usua_usu AS "codi_usua_usu",
                  CASE WHEN mp.codi_empl_per IS NULL THEN p.DEPARTAMENTO_ID ELSE mp.codi_depa_dpt END AS "codi_depa_dpt",
                  CASE WHEN mp.codi_empl_per IS NULL THEN p.PROVINCIA_ID ELSE mp.codi_prov_tpr END AS "codi_prov_tpr",
                  CASE WHEN mp.codi_empl_per IS NULL THEN p.DISTRITO_ID ELSE mp.codi_dist_tdi END AS "codi_dist_tdi",
                  mp.sede_remu_per AS "codi_sede_sed",
                  si.desc_sede_sed AS "desc_sede_sed",
                  p.persona_id AS "persona_id",
                  CASE WHEN mp.codi_empl_per IS NULL THEN p.NOMBRES ELSE mp.NOM_EMP_PER || ' ' || mp.APE_PAT_PER || ' ' || mp.APE_MAT_PER END AS "name",
                  mp.NOM_EMP_PER AS "nom_emp_per",
                  mp.APE_PAT_PER AS "ape_pat_per",
                  mp.APE_MAT_PER AS "ape_mat_per",
                  su.codi_empl_per AS "codi_empl_per",
                  CASE WHEN p.RUC IS NOT NULL THEN p.RUC WHEN p.DOCUMENTO_TIPO = '01' THEN p.DOCUMENTO_NUMERO ELSE NULL END AS "ruc",
                  CASE WHEN p.DOCUMENTO_TIPO = '01' THEN p.DOCUMENTO_NUMERO END AS "dni",
                  x.email AS "email",
                  CASE WHEN mp.codi_empl_per IS NULL THEN 'USER_EXT' ELSE 'SENASA' END AS "use_rol",
                  CASE WHEN x.status = '3' THEN 1 ELSE 0 END AS "is_admin",
                  CASE WHEN x.USER_ID IS NOT NULL THEN 1 ELSE 0 END AS "is_in_trazabilidad",
                  su.flag_acti_usu AS "flag_acti_usu"
        FROM      SEGURIDAD.seg_usuario su
        LEFT JOIN SIGA.maestro_personal mp          ON mp.codi_empl_per = su.codi_empl_per
        LEFT JOIN SISTEMAS.PERSONA p                ON su.persona_id = p.persona_id
        LEFT JOIN SEGURIDAD.USUARIOS_TRAZABILIDAD x ON x.codi_usua_usu = su.codi_usua_usu
        LEFT JOIN SIGA.sedes_inei si                ON si.codi_sede_sed = mp.sede_remu_per
        WHERE     su.flag_acti_usu='A' `;

  switch (attr) {
    case "username":
      qry += `AND UPPER(su.codi_usua_usu)=UPPER(:value)`;
      break;
    case "email":
      qry += `AND UPPER(x.email)=UPPER(:value)`;
      break;
    case "dni":
      qry += `AND UPPER(dni)=UPPER(:value)`;
      break;
    default:
      return result;
  }

  try {
    db = await oracle.connect();
    result = await db.execute(qry, [value], { outFormat: 4002 });
  } catch (err) {
    logger.error(err);
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  return result;
};

const getOne = async (id, attr) => {
  let result;

  /*
    switch(attr) {
        case ATTR.DNI[1]:
            qry = `SELECT ${TABLE}.${ATTR.DNI[0]} AS "${ATTR.DNI[1]}" `;
            break;
        case ATTR.FIRSTNAME[1]:
            qry = `SELECT ${TABLE}.${ATTR.FIRSTNAME[0]} AS "${ATTR.FIRSTNAME[1]}" `;
            break;
        case ATTR.LASTNAME[1]:
            qry = `SELECT ${TABLE}.${ATTR.LASTNAME[0]} AS "${ATTR.LASTNAME[1]}" `;
            break
        case ATTR.EMAIL[1]:
            qry = `SELECT ${TABLE}.${ATTR.EMAIL[0]} AS "${ATTR.EMAIL[1]}" `;
            break;
        case ATTR.PASSWORD[1]:
            qry = `SELECT ${TABLE}.${ATTR.PASSWORD[0]} AS "${ATTR.PASSWORD[1]}" `;
            break;
        case ATTR.STATUS[1]:
            qry = `SELECT ${TABLE}.${ATTR.STATUS[0]} AS "${ATTR.STATUS[1]}" `;
            break;
        default:
            return result;
    }

    qry += `FROM ${SCHEMA}.${TABLE}
            WHERE ${TABLE}.${ATTR.DELETED[0]}=0
            AND ${TABLE}.${ATTR.ID[0]}=:id`;

    try{
        db = await oracle.connect();
        result = await db.execute(qry, [ id ], { outFormat: 4002 });
        await db.close();
    }catch(err){
        logger.error(err);
    }
    */

  return result;
};

const insert = async (data) => {
  let qry, password, db, result;
  qry = `INSERT INTO ${SCHEMA}.USUARIOS_TRAZABILIDAD (
        USER_ID,
        DNI,
        FIRSTNAME,
        LASTNAME,
        EMAIL,
        CODI_USUA_USU,
        PASSWORD,
        CREATION_DATE,
        USER_CREA,
        FECH_CREA,
        USER_MODI,
        FECH_MODI
    ) VALUES (
        ${SCHEMA}.SECUENCIA_USUARIO.NEXTVAL,
        :dni,
        :firstname,
        :lastname,
        :email,
        :username,
        :password,
        SYSDATE,
        USER,
        SYSDATE,
        USER,
        SYSDATE
    )`;

  password = await encrypt(data.password);

  try {
    db = await oracle.connect();
    await db.execute(
      qry,
      [
        data.dni,
        data.firstname,
        data.lastname,
        data.email,
        data.username,
        password,
      ],
      { autoCommit: true }
    );
    result = true;
  } catch (err) {
    result = false;
    logger.error(err);
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  return result;
};

const encrypt = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

const update = async (id, attr, value) => {
  let qry, db, result;
  qry = `UPDATE ${SCHEMA}.USUARIOS_TRAZABILIDAD SET FECH_MODI=SYSDATE `;

  switch (attr) {
    case "status":
      qry += `SET STATUS=:value `;
      break;
    case "password":
      value = await encrypt(value);
      qry += `SET PASSSWORD=:value `;
      break;
    default:
      return false;
  }

  qry += `WHERE CODI_USUA_USU=:id AND DELETED=0 `;

  try {
    db = await oracle.connect();
    await db.execute(qry, [value, id], { autoCommit: true });
    result = true;
  } catch (err) {
    logger.error(err);
    result = false;
  } finally {
    if (db) {
      try {
        await db.close();
      } catch (err) {
        logger.error(err);
      }
    }
  }

  return result;
};

module.exports = {
  auth,
  update,
  get,
  getOne,
  getUsersTraceability,
  insert,
  SCHEMA,
};
