const { response } = require("express");
const jwt = require("jsonwebtoken");


const validateJWT = async(req, res = response, next) => {

    // Reference to x-token in headers
    const token = req.header('x-token');

    if ( !token ) {
        res.status(401).json({
            ok: false,
            msg: "No token in the request"
        })
    }

    try {
        // this is the payload
        const { uid, name } = jwt.verify( token, process.env.SECRET_JWT_SEED )

    
        req.uid = uid;
        req.name = name

    } catch (err) {
        console.error(err)
        res.status(401).json({
            msg: "Invalid token provided"
        })
    }

    next()

}

module.exports = {
    validateJWT
}