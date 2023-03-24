if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { resolveSoa } = require('dns');
const ExpressError = require('./utilities/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');


// Routes
const campgroundRoute = require('./routes/campgrounds');
const reviewRoute = require('./routes/reviews');
const userRoute = require('./routes/users');
const User = require('./models/user')

const database_name = 'yelp-camp'

const dbUrl = process.env.DB_URL || `mongodb://localhost:27017/${database_name}`;

mongoose.connect(dbUrl)
.then(() => {
    console.log("MONGO CONNECTION SUCCESS")
})


app.engine('ejs', ejsMate) // Use ejs-locals for all ejs templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

// Session
const secret = process.env.SECRET || 'secret';

const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

// Express Mongo Sanitize
app.use(mongoSanitize()); // To remove data with $ and .

// Passport Library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // Get user data into session
passport.deserializeUser(User.deserializeUser()); // Get user data out of session


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);
app.use('/', userRoute);


app.get('/', (req, res) => {
    res.render('home')
});

// Error Handling
// Check if id of campground exists

app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;
    if (!err.message) err.message = "Oh no, Something Went Wrong";
    res.status(err.status).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
}) 