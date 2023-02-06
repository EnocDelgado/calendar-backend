const jwt = require('jsonwebtoken');


const generateJWT = ( uid, name ) => {

    return new Promise( ( resolve, reject ) => {

        const payload = { uid, name };

        // this craete a unique word that allow to know if is the token to  recognize
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
            // if token is invalid return error
        }, ( err, token) => {

            if (err) { 
                console.log( err );
                reject('Could not generate token')
            }

            resolve( token );
        })
    })

}


module.exports = {
    generateJWT
}