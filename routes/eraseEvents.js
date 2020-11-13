const express = require('express');
const router = express.Router();

const eventController = require('../controllers/events')
// Route related to delete events

router.delete('', eventController.eraseEvents) // Erase all events and cascade delete

module.exports = router;