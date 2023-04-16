const Guide = require('./models/touristGuide');
const Hotel = require('./models/hotel');
const Restaurant = require('./models/restaurant');
const Visit = require('./models/visit');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/register');
    }
    next();
}


module.exports.isAuthorGuide = async (req, res, next) => {
    const { id } = req.params;
    const touristGuide = await Guide.findById(id);
    if (!touristGuide.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/touristGuides/${id}`);
    }
    next();
}

module.exports.isAuthorRes = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}

module.exports.isAuthorSpot = async (req, res, next) => {
    const { id } = req.params;
    const spot = await Visit.findById(id);
    if (!spot.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/spots/${id}`);
    }
    next();
}

module.exports.isAuthorHotel = async (req, res, next) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    if (!hotel.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/hotels/${id}`);
    }
    next();
}

module.exports.isReviewAuthorGuide = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    console.log(review.author)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/touristGuides/${id}`);
    }
    next();
}

module.exports.isReviewAuthorHotel = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/hotels/${id}`);
    }
    next();
}

module.exports.isReviewAuthorSpot = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/spots/${id}`);
    }
    next();
}

module.exports.isReviewAuthorRes = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        console.log(review.author)
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/restaurants/${id}`);
    }
    next();
}