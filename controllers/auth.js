const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/validate-jwt");

const createUser = async(req, res = response ) => {

    // params that we received from body
    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email });

        // Validate if user is already exists
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect email or password'
            })
        }

        //model to create a user on MongoDB
        user = new User( req.body );

        // Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // saved in mongo
        await user.save();

        // Generate Json Web Token
        const token = await generateJWT( user.id, user.name)

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch ( error ) {

        console.log( error );

        res.status(500).json({
            ok: false,
            error: 'Please contact the administrator'
        });

    };
    
}

const loginUser = async(req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verify if already exist an user
        let user = await User.findOne({ email });

        // Validate if user is already exists
        if ( !user ) {
            return res.status(400).json({
                ok: true,
                msg: `User does not exists`
            })
        }

        // Validate password
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: true,
                msg: 'Incorrect email or password'
            });
        }

        // Generate JSON Web Token
        const token = await generateJWT( user.id, user.name);


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch ( error ) {

        console.log( error );

        res.status(500).json({
            ok: false,
            error: 'Please contact the administrator'
        });
    }

    
}


const revalidateToken = async(req, res = response ) => {

    const { uid, name } = req;

    // Generate a new token an return it to the request
    const token = await generateJWT( uid, name );

    res.status(201).json({
        ok: true,
        uid, name,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken
}