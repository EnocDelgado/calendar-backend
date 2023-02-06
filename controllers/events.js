const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async(req, res = response) => {

    const events = await Event.find()
                                // return specific fields
                                .populate('user', 'name');

    res.status(201).json({
        ok: true,
        events
    })
}

const createEvent = async(req, res = response) => {

    const event = new Event( req.body );

    // verifiy if exists any event
    try {
        // get user id how is creating the event
        event.user = req.uid;

        const savedEvent = await event.save();

        res.status(201).json({
            ok: true,
            event: savedEvent
        })

    } catch ( error ) {
        console.log( error );

        res.status(500).json({
            ok: false,
            error: 'Please contact the administrator'
        });

    }
}

const updateEvent = async(req, res = response) => {

    // get an event id
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        // verify it exists event
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            })
        }

        // verify if user taht created event is the same that wants to be updated
        if ( event.user.toString() !== uid ) {
            return res.status(404).json({
                ok: false,
                msg: 'You do not have editing privileges for this event'
            })
        }

        // get all params to update 
        const newEvent = {
            ...req.body,
            user: uid
        }

        // Update event
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } ); 

        res.status(201).json({
            ok: true,
            event: eventUpdated
        });

    } catch ( error ) {
        console.log( error );

        res.status(500).json({
            ok: false,
            error: 'Please contact the administrator'
        });

    }
}

const deleteEvent = async(req, res = response) => {
    
    // get an event id
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        // verify it exists event
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found'
            });
        }

        // verify if user that created event is the same that wants to delete
        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'You do not have editing privileges for this event'
            });
        }

        // Delete event
        await Event.findByIdAndDelete( eventId );

        res.status(201).json({
            ok: true,
            msg: 'Event deleted'
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the administrator'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}