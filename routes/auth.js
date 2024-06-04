import express from 'express'

const router = express.Router();


//middleware
import { requireSignin } from '../middlewares';

//require controllers

import {register, login, logout, csrfController, currentUser, sendTestEmail, forgotPassword, resetPassword} from '../controllers/auth'

router.post('/register', register);
router.post('/login', login);
router.get('/logout',logout);
router.get('/csrf-token', csrfController);
router.get('/current-user', requireSignin, currentUser);
router.get('/send-email', sendTestEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)


module.exports = router;