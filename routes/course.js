import express from 'express'
import formidable from 'express-formidable'

const router = express.Router();


//middleware
import { requireSignin, isInstructor, isEnrolled } from '../middlewares';

//require controllers

import {
    uploadImage,
    removeImage,
    create,
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    update, 
    removeLesson,
    updateLesson,
    publishCourse,
    unpublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    markCompleted,
    listCompleted,
    markIncompleted,
    checkPaid,
    flwPaidEnrollment,
    handleFlwpaidEnrollment
} from '../controllers/course'

router.get('/courses', courses)
router.get('/flw_courseenroll/:courseId', requireSignin,flwPaidEnrollment);
router.get('/user-courses', requireSignin, userCourses)

//images route
router.post('/course/upload-image', uploadImage)
router.post('/course/remove-image', removeImage)

//course
//single params
router.get('/flw-success/:course', requireSignin, handleFlwpaidEnrollment);
router.post('/course', requireSignin, isInstructor, create)
router.put('/course/:slug',requireSignin, update)
router.get('/course/:slug',read)
router.put('/course/publish/:courseId', requireSignin, publishCourse);
router.put('/course/unpublish/:courseId', requireSignin, unpublishCourse);
router.post('/course/video-upload/:instructorId', requireSignin, formidable(), uploadVideo)
router.post('/course/remove-video/:instructorId', requireSignin, removeVideo)

router.get('/user/course/:slug',requireSignin, isEnrolled, read)
//two params
router.post('/course/lesson/:slug/:instructorId',
    requireSignin,
    addLesson
)

router.put('/course/lesson/:slug/:instructorId',
    requireSignin,
    updateLesson 
)
router.put('/course/:slug/:lessonId', requireSignin, removeLesson)

//enrollment routes
router.get('/check-paid/:courseId', requireSignin,checkPaid)
router.get('/flw-callback/*',flwPaidEnrollment)
router.get('/check-enrollment/:courseId', requireSignin, checkEnrollment)
router.post('/free-enrollment/:courseId',requireSignin, freeEnrollment)
router.post('/paid-enrollment/:courseId',requireSignin, paidEnrollment)

router.get('/stripe-success/:courseId', requireSignin, stripeSuccess)

//mark completed

router.post('/mark-completed', requireSignin, markCompleted);
router.post(`/list-completed`, requireSignin, listCompleted);
router.post(`/list-incomplete`, requireSignin, markIncompleted);

// http://localhost:3000/flw/61b4c32202f66e3a73b7c224?status=successful&tx_ref=2pAoXh1vCSYTxSqAgeEWB&transaction_id=3221585

module.exports = router;


