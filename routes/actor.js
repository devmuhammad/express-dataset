const express = require('express');
const router = express.Router();

const actorController = require('../controllers/actors')
// Routes related to actor.

router.get('', actorController.getAllActors) //Get Request for all Actors ordered by number of events

router.put('', actorController.updateActor) //Update Request for Actor Avatar URL

router.get('/streak', actorController.getStreak) // Get Request for maximum streak by actor


module.exports = router;