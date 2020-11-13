
const express = require('express');
const router = express.Router();

const eventController = require('../controllers/events');

// Routes related to event

router.post('', eventController.addEvent) // Post request to Add new Event

router.get('', eventController.getAllEvents) // Post request to return all Events

router.get('/actors/:actorID', eventController.getByActor) // Get request to retrieve events by actor Id {Params}


module.exports = router;
