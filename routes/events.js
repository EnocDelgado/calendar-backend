

const { Router }= require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Validate all token in all CRUD
router.use( validateJWT );

// Get Events
router.get('/', getEvents)

// Create a new event
router.post(
    '/', 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom( isDate ),
        check('end', 'End date is required').custom( isDate ),
        validateFields
    ],
createEvent)

// Update events
router.put(
    '/:id', 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom( isDate ),
        check('end', 'End date is required').custom( isDate ),
        validateFields
    ],

updateEvent)

// Delete events
router.delete('/:id', deleteEvent)

module.exports = router;