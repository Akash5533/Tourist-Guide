const express = require('express')
const app = express()
const ejsMate = require('ejs-mate')
const path = require('path')
const { guideSchema, reviewSchema, visitSchema, restaurantSchema, hotelSchema } = require('./schemas.js');
const methodOverride = require('method-override')
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const Guide = require('./models/touristGuide');
const Hotel = require('./models/hotel');
const Restaurant = require('./models/restaurant');
const Visit = require('./models/visit')
const mongoose = require('mongoose');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn,isAuthorHotel,isAuthorSpot,isAuthorRes,isAuthorGuide,isReviewAuthorGuide,isReviewAuthorHotel,isReviewAuthorSpot,isReviewAuthorRes } = require('./middleware');

// mongoose.connect('mongodb://localhost:27017/tourista')

mongoose.connect('mongodb://127.0.0.1:27017/tourista')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected');
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    // console.log(res.locals.currentUser)
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

const validateGuide = (req, res, next) => {
    const { error } = guideSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateHotel = (req, res, next) => {
    const { error } = hotelSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateRestaurant = (req, res, next) => {
    const { error } = restaurantSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateVisit = (req, res, next) => {
    const { error } = visitSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/business', (req, res) => {
    res.render('business/business');
});

app.get('/touristGuides/business', (req, res) => {
    res.render('business/business');
});

app.get('/hotels/business', (req, res) => {
    res.render('business/business');
});

app.get('/restaurants/business', (req, res) => {
    res.render('business/business');
});

app.get('/spots/business', (req, res) => {
    res.render('business/business');
});

app.get('/register', (req, res) => {
    res.render('users/register');
});

app.get('/touristGuides/register', (req, res) => {
    res.render('users/register');
});

app.get('/spots/register', (req, res) => {
    res.render('users/register');
});

app.get('/hotels/register', (req, res) => {
    res.render('users/register');
});

app.get('/restaurants/register', (req, res) => {
    res.render('users/register');
});

app.post('/signup', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Tourista!');
            res.redirect('/touristGuides');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/register' ,keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

// app.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', "Goodbye!");
//     res.redirect('/touristGuides');
// })

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/');
    });
  });

  app.get('/touristGuides/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/');
    });
  });

  app.get('/spots/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/');
    });
  });

  app.get('/hotels/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/');
    });
  });

  app.get('/restaurants/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/');
    });
  });

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/touristGuides', catchAsync(async (req, res) => {
    // const guide = new TouristGuide({ name: 'akash', price: 3000, location: 'mathur', experience: '10', language: 'tamil' })
    // await guide.save()
    // res.send(guide)
    const touristGuides = await Guide.find({});
    res.render('touristGuide/index.ejs', { touristGuides })
}))

app.get('/touristGuides/search', catchAsync(async (req, res) => {
    const { q } = req.query;
    const touristGuides = await Guide.find({$or:[{state:{$regex: new RegExp(q, 'i')}},{name:{$regex: new RegExp(q, 'i')}},{city:{$regex: new RegExp(q, 'i')}}]})
    // console.log(touristGuide) if there is nothing inside touristGuides then it will print [] it is not equal to ! because it is truthy value
    if (touristGuides.length === 0) {
        req.flash('error', 'Cannot find that TouristGuide!');
        return res.redirect('/touristGuides');
      } else {
        res.render('touristGuide/index.ejs', { touristGuides })
      }
}))
//     var pattern="cd"
// var repeats=3
// new RegExp(`${pattern}{${repeats}}`, "g") 
//     var name = 'abc';
// new RegExp(name, 'i');
// turns into:
// /abc/i
    
app.get('/touristGuides/new',isLoggedIn, (req, res) => {
    res.render('touristGuide/new')
})

app.post('/touristGuides', validateGuide,isLoggedIn, catchAsync(async (req, res) => {
    // if (!req.body.touristGuide) throw new ExpressError('Invalid touristGuide Data', 400);
    const touristGuide = new Guide(req.body.touristGuide)//here tourist guide is do
    touristGuide.author = req.user._id;
    // console.log(touristGuide.author);
    await touristGuide.save()
    req.flash('success', 'Successfully made a new Tourist Guide!');
    res.redirect(`/touristGuides/${touristGuide._id}`)
}))



app.get('/touristGuides/:id', catchAsync(async (req, res) => {
    const touristGuide = await Guide.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
        // console.log(touristGuide) if there is nothing inside touristGuide then it will print null it is equal to !

    if (!touristGuide) {
        req.flash('error', 'Cannot find that TouristGuide!');
        return res.redirect('/touristGuides');
    }
    res.render('touristGuide/show', { touristGuide })
}))

app.get('/touristGuides/:id/edit',isLoggedIn,isAuthorGuide, catchAsync(async (req, res) => {
    const touristGuide = await Guide.findById(req.params.id)
    if (!touristGuide) {
        req.flash('error', 'Cannot find that TouristGuide!');
        return res.redirect('/touristGuides');
    }
    res.render('touristGuide/edit', { touristGuide })
}))

app.put('/touristGuides/:id', validateGuide,isLoggedIn,isAuthorGuide, catchAsync(async (req, res) => {
    const { id } = req.params
    const touristGuide = await Guide.findByIdAndUpdate(id, { ...req.body.touristGuide })
    req.flash('success', 'Successfully updated TouristGuide!');
    res.redirect(`/touristGuides/${touristGuide._id}`)
}))

app.delete('/touristGuides/:id',isLoggedIn,isAuthorGuide, catchAsync(async (req, res) => {
    const { id } = req.params
    await Guide.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted TouristGuide')
    res.redirect('/touristGuides')
}))

app.get('/touristGuides/:id/reviews', catchAsync(async (req, res) => {
    const touristGuide = await Guide.findById(req.params.id).populate('reviews');
    res.render('touristGuide/show', { touristGuide })
}))

app.post('/touristGuides/:id/reviews', validateReview,isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const touristGuide = await Guide.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review.author)
    touristGuide.reviews.push(review);
    await review.save();
    await touristGuide.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/touristGuides/${id}`);
}))

app.delete('/touristGuides/:id/reviews/:reviewId',isLoggedIn,isReviewAuthorGuide, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Guide.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/touristGuides/${id}`);
}))


// ---------------------------------------------------------------------------------------------


app.get('/spots', catchAsync(async (req, res) => {
    const spots = await Visit.find({});
    res.render('spot/index.ejs', { spots })
}))

app.get('/spots/search', catchAsync(async (req, res) => {
    const { q } = req.query
    const spots = await Visit.find({$or:[{state:{$regex: new RegExp(q, 'i')}},{name:{$regex: new RegExp(q, 'i')}},{city:{$regex: new RegExp(q, 'i')}}]})
      // console.log(touristGuide) if there is nothing inside touristGuides then it will print [] it is not equal to ! because it is truthy value
      if (spots.length === 0) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
      } else {
        res.render('spot/index.ejs', { spots })
    }
}))

app.get('/spots/new',isLoggedIn, (req, res) => {
    res.render('spot/new')
})

app.post('/spots', validateVisit,isLoggedIn, catchAsync(async (req, res) => {
    // res.send(req.body)
    // if (!req.body.touristGuide) throw new ExpressError('Invalid touristGuide Data', 400);
    const spot = new Visit(req.body.spot)//here tourist guide is do or visit
    spot.author = req.user._id;
    await spot.save()
    req.flash('success', 'Successfully made a new spot!');
    res.redirect(`/spots/${spot._id}`)
}))



app.get('/spots/:id', catchAsync(async (req, res) => {
    const spot = await Visit.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(spot);
    if (!spot) {
        req.flash('error', 'Cannot find that spot!');  
        return res.redirect('/spots');
    }   
     res.render('spot/show', { spot })
}))

app.get('/spots/:id/edit', isLoggedIn,isAuthorSpot,catchAsync(async (req, res) => {
    const spot = await Visit.findById(req.params.id)
    if (!spot) {
        req.flash('error', 'Cannot find that spot!');
        return res.redirect('/spots');
    }  
        res.render('spot/edit', { spot })
}))

app.put('/spots/:id', validateVisit,isLoggedIn,isAuthorSpot, catchAsync(async (req, res) => {
    const { id } = req.params
    const spot = await Visit.findByIdAndUpdate(id, { ...req.body.spot })
    req.flash('success', 'Successfully edited the spot!');
    res.redirect(`/spots/${spot._id}`)
}))

app.delete('/spots/:id',isLoggedIn,isAuthorSpot, catchAsync(async (req, res) => {
    const { id } = req.params
    await Visit.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted the spot!');
    res.redirect('/spots')
}))

app.get('/spots/:id/reviews', catchAsync(async (req, res) => {
    const spot = await Visit.findById(req.params.id).populate('reviews');
    res.render('spot/show', { spot })
}))

app.post('/spots/:id/reviews', validateReview,isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await Visit.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/spots/${id}`);
}))

app.delete('/spots/:id/reviews/:reviewId',isLoggedIn,isReviewAuthorSpot, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Visit.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/spots/${id}`);
}))


// -------------------------------------------------------------------------------------------------------------


app.get('/hotels', catchAsync(async (req, res) => {
    // const guide = new TouristGuide({ name: 'akash', price: 3000, location: 'mathur', experience: '10', language: 'tamil' })
    // await guide.save()
    // res.send(guide)
    const hotels = await Hotel.find({});
    res.render('hotel/index.ejs', { hotels })
}))
app.get('/hotels/search', catchAsync(async (req, res) => {
    const { q } = req.query;
    const hotels = await Hotel.find({$or:[{state:{$regex: new RegExp(q, 'i')}},{name:{$regex: new RegExp(q, 'i')}},{city:{$regex: new RegExp(q, 'i')}}]})
      // console.log(touristGuide) if there is nothing inside touristGuides then it will print [] it is not equal to ! because it is truthy value
      if (hotels.length === 0) {
        req.flash('error', 'Cannot find that hotels!');
        return res.redirect('/hotels');
      } else {
        res.render('hotel/index', { hotels })
    }
}))

app.get('/hotels/new', isLoggedIn,(req, res) => {
    res.render('hotel/new')
})

app.post('/hotels', validateHotel,isLoggedIn, catchAsync(async (req, res) => {
    // if (!req.body.touristGuide) throw new ExpressError('Invalid touristGuide Data', 400);
    const hotel = new Hotel(req.body.hotel)//here tourist guide is do
    hotel.author = req.user._id;
    await hotel.save()
    req.flash('success', 'Successfully made a new hotel!');
    res.redirect(`/hotels/${hotel._id}`)
}))

app.get('/hotels/:id', catchAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(hotel);
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }  
        res.render('hotel/show', { hotel })
}))

app.get('/hotels/:id/edit',isLoggedIn,isAuthorHotel, catchAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id)
    if (!hotel) {
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }  
        res.render('hotel/edit', { hotel })
}))

app.put('/hotels/:id', validateHotel,isLoggedIn,isAuthorHotel, catchAsync(async (req, res) => {
    const { id } = req.params
    const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel })
    req.flash('success', 'Successfully edited the hotel!');
    res.redirect(`/hotels/${hotel._id}`)
}))

app.delete('/hotels/:id',isLoggedIn,isAuthorHotel, catchAsync(async (req, res) => {
    const { id } = req.params
    await Hotel.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted the hotel!');
    res.redirect('/hotels')
}))

app.get('/hotels/:id/reviews', catchAsync(async (req, res) => {
    const hotel = await Hotel.findById(req.params.id).populate('reviews');
    res.render('hotel/show', { hotel })
}))

app.post('/hotels/:id/reviews', validateReview,isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/hotels/${id}`);
}))

app.delete('/hotels/:id/reviews/:reviewId',isLoggedIn,isReviewAuthorHotel,catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/hotels/${id}`);
}))



// -------------------------------------------------------------------------------------------------------------



app.get('/restaurants', catchAsync(async (req, res) => {
    // const guide = new TouristGuide({ name: 'akash', price: 3000, location: 'mathur', experience: '10', language: 'tamil' })
    // await guide.save()
    // res.send(guide)
    const restaurants = await Restaurant.find({});
    res.render('restaurant/index.ejs', { restaurants })
}))

app.get('/restaurants/search', catchAsync(async (req, res) => {
    const { q } = req.query
    const restaurants = await Restaurant.find({$or:[{state:{$regex: new RegExp(q, 'i')}},{city:{$regex: new RegExp(q, 'i')}},{name:{$regex: new RegExp(q, 'i')}}]})
      // console.log(touristGuide) if there is nothing inside touristGuides then it will print [] it is not equal to ! because it is truthy value
      if (restaurants.length === 0) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
      } else {
        res.render('restaurant/index.ejs', { restaurants })
      }
}))

app.get('/restaurants/new',isLoggedIn, (req, res) => {
    res.render('restaurant/new')
})

app.post('/restaurants', validateRestaurant,isLoggedIn, catchAsync(async (req, res) => {
    // if (!req.body.touristGuide) throw new ExpressError('Invalid touristGuide Data', 400);
    const restaurant = new Restaurant(req.body.restaurant)//here tourist guide is do
    restaurant.author = req.user._id;
    await restaurant.save()
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`)
}))



app.get('/restaurants/:id', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(restaurant);
        if (!restaurant) {
            req.flash('error', 'Cannot find that restaurant!');
            return res.redirect('/restaurants');
        }  
    res.render('restaurant/show', { restaurant })
}))

app.get('/restaurants/:id/edit',isLoggedIn,isAuthorRes, catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }  
        res.render('restaurant/edit', { restaurant })
}))

app.put('/restaurants/:id', validateRestaurant,isLoggedIn,isAuthorRes, catchAsync(async (req, res) => {
    const { id } = req.params
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant })
    req.flash('success', 'Successfully made edited the restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`)
}))

app.delete('/restaurants/:id',isLoggedIn,isAuthorRes, catchAsync(async (req, res) => {
    const { id } = req.params
    await Restaurant.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully made deleted the restaurant!');
    res.redirect('/restaurants')
}))

app.get('/restaurants/:id/reviews', catchAsync(async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id).populate('reviews');
    res.render('restaurant/show', { restaurant })
}))

app.post('/restaurants/:id/reviews', validateReview,isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/restaurants/${id}`);
}))

app.delete('/restaurants/:id/reviews/:reviewId',isLoggedIn,isReviewAuthorRes,catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurant.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/restaurants/${id}`);
}))



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
    console.log('welcome')
})