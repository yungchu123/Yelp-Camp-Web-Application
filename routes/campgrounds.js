const express = require('express');
const router = express.Router();

const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.newCampground))


router.get('/new', isLoggedIn, campgrounds.newCampgroundForm)

router.route('/:id')
    .get(catchAsync(campgrounds.renderCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampgroundForm))

module.exports = router;