const users  = require('../models/users');

const getByID = async (req, res) => {
    if (!req.params.id){
        res.status(400).json({
            message: 'ID is mandatory'
        });
        return
    }

    let result = await users.get('username', req.params.id);
    console.log(result)

    if (!result){
        res.status(500).json({
            message: 'Database error'
        })
        return
    }

    if (result.rows.length == 0){
        res.status(404).json({
            message: 'User not found'
        })
        return
    }

    res.json({
        message: 'User found',
        user: result.rows
    });
    return
}

const getStatus = async (req, res) => {
    if (!req.params.id){
        res.status(400).json({
            message: 'ID is mandatory'
        });
        return
    }

    let result = await users.getOne(req.params.id, 'status');

    if (!result){
        res.status(500).json({
            message: 'Database error'
        })
        return
    }

    if (result.rows.length == 0){
        res.status(404).json({
            message: 'User not found'
        })
        return
    }

    res.json({
        message: 'User found',
        user: result.rows
    });
    return
}

const get = async (req, res) => {
    if (!req.query.attr || !req.query.value){
        res.status(400).json({
            message: 'Attribute and Value are mandatory',
            user: []
        });
        return
    }

    let result = await users.get(req.query.attr, req.query.value);

    if (!result){
        res.status(500).json({
            message: 'Database error',
            user: []
        })
        return
    }

    if (result.rows.length == 0){
        res.status(404).json({
            message: 'User not found',
            user: []
        })
        return
    }

    res.json({
        message: 'User found',
        user: result.rows
    });
}

const getUsersTraceability = async (req, res) => {
    if (!req.query.attr || !req.query.value){
        res.status(400).json({
            message: 'Attribute and Value are mandatory',
            user: []
        });
        return
    }

    let result = await users.getUsersTraceability(req.query.attr, req.query.value);

    if (!result){
        res.status(500).json({
            message: 'Database error',
            user: []
        })
        return
    }

    if (result.rows.length == 0){
        res.status(404).json({
            message: 'User not found',
            user: []
        })
        return
    }

    res.json({
        message: 'Users found',
        user: result.rows
    });
}

const auth = async (req, res) => {
    if (!req.query.user || !req.query.pass){
        res.status(400).json({
            message: 'User and Password are mandatory',
            user: []
        });
        return
    }

    let result = await users.auth(req.query.user, req.query.pass);

    if (!result){
        res.status(500).json({
            message: 'Database error',
            user: []
        })
        return
    }

    if (result.user == ''){
        res.status(404).json({
            message: 'User not found',
            user: []
        })
        return
    }

    res.json({
        message: 'User found',
        user: result
    });
}

const create = async (req, res) => {
    if (!req.body.email ||
        !req.body.password ||
        !req.body.firstname ||
        !req.body.lastname ||
        !req.body.username ||
        !req.body.dni
        ){
        res.status(400).json({
            message: 'Email, password, username, dni, firstname and lastname are mandatory',
            user: []
        });
        return
    }

    let r = await users.insert(req.body);

    if (!r){
        res.status(500).json({
            message: 'Database error'
        })
        return
    }

    res.json({
        message: 'User created successfully'
    });
}

const updateByID = async (req, res) => {
    if (!req.params.id){
        res.status(400).json({
            message: 'Username is mandatory'
        });
        return
    }

    if (!req.body.attr || !req.body.value){
        res.status(400).json({
            message: 'Attribute and Value are mandatory',
            user: []
        });
        return
    }

    let r = await users.update(req.params.id, req.body.attr, req.body.value);

    if (!r) {
        res.status(500).json({
            message: 'Database error'
        })
        return
    }

    res.json({
        message: 'Update successful'
    })
    return
}

module.exports = {
    auth,
    updateByID,
    getByID,
    getStatus,
    getUsersTraceability,
    get,
    create
}