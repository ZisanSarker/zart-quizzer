const express = require('express');
const controller = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.delete('/deleteAccount', authMiddleware, controller.deleteUserAccount);
router.post('/change-password', authMiddleware, controller.changePassword);

module.exports = router;
