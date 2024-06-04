import express from 'express'


const router = express.Router();


//middleware
import { requireSignin } from '../middlewares';

//require controllers

import {makeInstructor, getAccountStatus, makeInstructorFlutter, getBank, currentInstructor, instructorCourses} from '../controllers/instructor'


router.post('/make-instructor', requireSignin, makeInstructor)
router.post('/get-account-status', requireSignin, getAccountStatus)
router.post('/make-instructor/flutterwave', requireSignin, makeInstructorFlutter)
router.post('/get-banks', getBank)
router.get('/current-instructor', requireSignin, currentInstructor)
router.get('/instructor-courses', requireSignin, instructorCourses)

module.exports = router;