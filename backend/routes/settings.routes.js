const express = require('express');
const controller = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// DELETE /settings/account
router.delete('/deleteAccount', authMiddleware, controller.deleteUserAccount);

module.exports = router;
