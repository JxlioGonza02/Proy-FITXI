const express = require('express');
const router = express.Router();
const expertoController = require('../controllers/expertoController');

router.post('/register', expertoController.register);
router.post('/login', expertoController.login);

module.exports = router;