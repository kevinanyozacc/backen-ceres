const users  = require('../services/users'),
      jwt    = require('jsonwebtoken'),
      bcrypt = require('bcrypt');

const mailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const login = async (req, res) => {
    if (!req.body.user || !req.body.password){
        res.status(400).send({
            message: 'User and Password are mandatory'
        });
        return
    }

    let user = await users.auth(req.body.user, req.body.password);

    if (!user){
        res.status(404).send({
            message: 'User not found'
        })
        return
    }

    const payload = {
        id: user.user,
        ldap: user.ldap,
        role: user.role,
        hq: user.hq,
        is_admin: user.is_admin,
        name: user.name,
    };

    //users.update(user.user_id, 'status', '1');

    expiresIn = 60000;

    if (process.env.TOKEN_EXPIRES) {
        expiresIn = process.env.TOKEN_EXPIRES
    }

    res.send({
        message: 'Authentication successful',
        token: jwt.sign(payload, process.env.PRIVATE_KEY, { expiresIn: expiresIn })
    });
    return
}

const whoami = async (req, res) => {
    decoded = req.decoded;
    if (!decoded.id){
        res.status(400).send({
            message: 'ID is mandatory'
        });
        return
    }

    /*
    if(!await checkStatus(decoded.id)){
        res.status(400).send({
            message: 'You are logged out'
        })
        return
    }
    */

    let user = await users.getByID(decoded.id);

    if (!user){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (user.length == 0){
        res.status(404).send({
            message: 'User not found'
        })
        return
    }

    delete user["password"];

    res.send({
        message: 'User found',
        user: user
    });
    return
}

const signup_auth = async (req, res) => {
    decoded = req.decoded;
    if (!decoded.role){
        res.status(400).send({
            message: 'Role is mandatory'
        });
        return
    }

    if (decoded.role != process.env.ADMIN_ROLE){
        res.status(401).send({
            message: "You're not authorized to execute this action"
        });
        return
    }

    if (!req.body.role_id){
        req.body.role_id = 1
    }

    await signup(req, res);
    return
}

const signup_noauth = async (req, res) => {
    req.body.role_id = 1

    await signup(req, res);
    return
}

const signup = async (req, res) => {
    if (!req.body.email ||
        !req.body.password ||
        !req.body.password_confirmation ||
        !req.body.firstname ||
        !req.body.lastname ||
        !req.body.dni
        ){
        res.status(400).json({
            message: 'Email, passwords, dni, firstname an lastname are mandatory'
        });
        return
    }

    if (!mailReg.test(req.body.email)) {
        res.status(400).send({
            message: 'Email is not valid'
        });
        return
    }

    if (req.body.password != req.body.password_confirmation) {
        res.status(400).json({
            message: "Password confirmation doesn't match"
        })
        return
    }

    let user = await users.get("email", req.body.email);

    if (user){
        res.status(400).send({
            message: 'User already registered'
        })
        return
    }

    r = await users.create(req.body);

    if (!r) {
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    res.send({
        message: `User ${req.body.email} was created`
    })
    return
}

const checkStatus = async (id) => {
    status = await users.getOne(id, 'status');

    if (!status){
        return false
    }

    if (status != "1") {
        return false
    }

    return true
}

const get = async (req, res) => {
    decoded = req.decoded;
    if (decoded.is_admin != '1'){
        res.status(400).send({
            message: "You aren't admin!"
        });
        return
    }

    let user = await users.getByID(req.params.user);

    if (!user){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (user.length == 0){
        res.status(404).send({
            message: 'User not found'
        })
        return
    }

    res.send({
        message: 'User found',
        user: user
    });
    return
}

const getNewlyRegistered = async (req, res) => {
    decoded = req.decoded;
    if (decoded.is_admin != '1'){
        res.status(400).send({
            message: "You aren't admin!"
        });
        return
    }

    let user = await users.getUsersTraceability("status", 0);

    if (!user){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (user.length == 0){
        res.status(404).send({
            message: 'User not found'
        })
        return
    }

    res.send({
        message: 'User found',
        user: user
    });
    return
}

const grantAdmin = async (req, res) => {
    decoded = req.decoded;
    if (decoded.is_admin != '1'){
        res.status(400).send({
            message: "You aren't admin!"
        });
        return
    }

    let user = await users.getByID(req.body.username);

    if (!user){
        res.status(500).send({
            message: 'Service error'
        })
        return
    }

    if (user.length == 0){
        res.status(404).send({
            message: 'User not found'
        })
        return
    }

    if (user.is_in_trazabilidad == 0){
        const data = {
            email: user.codi_usua_usu + '@SENASA.GOB.PE',
            password: 'invalid-field',
            firstname: user.nom_emp_per,
            lastname: user.ape_pat_per + ' ' + user.ape_mat_per,
            dni: user.dni,
        }

        r = await users.create(data);

        if (!r) {
            res.status(500).send({
                message: 'Service error'
            })
            return
        }
    }

    users.update(user.codi_usua_usu, 'status', '3');
    user.is_admin = 1;

    res.send({
        message: 'User updated',
        user: user
    });
    return
}

module.exports = {
    get,
    getNewlyRegistered,
    login,
    signup_auth,
    signup_noauth,
    whoami,
    grantAdmin
}