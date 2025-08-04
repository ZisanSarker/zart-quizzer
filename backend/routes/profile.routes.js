const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');

router.get('/me', profileController.getMyProfile);
router.put('/me', profileController.updateMyProfile);

module.exports = router;