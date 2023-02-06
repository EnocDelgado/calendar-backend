/**
 *  Users Routes
 *  host + /api/auth
 */
const { Router }= require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', );

// Create a new user
router.post(
    '/register', 
    [ // middlewares
        check( 'name', 'Name is required' ).not().isEmpty(),
        check( 'email', 'Email is required' ).isEmail(),
        check( 'password', 'Password must be longer than 6 characters').isLength({ min: 6 }),
        validateFields
    ], 
createUser );

// login user
router.post(
    '/', 
    [
        check( 'email', 'Email is required' ).isEmail(),
        check( 'password', 'Password must be longer than 6 characters').isLength({ min: 6 }),
        validateFields
    ],
loginUser );

// re-validate token
router.get('/renew', validateJWT, revalidateToken );


module.exports = router;