const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const sessionStore = require('connect-pg-simple')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcryptJs = require('bcryptjs');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const indexRouter = require('./routes/indexRouter.js');
const loginRouter = require('./routes/loginRouter.js');
const signupRouter = require('./routes/signupRouter.js');
const foldersRouter = require( './routes/foldersRouter.js' );
require('dotenv').config();


// EXPRESS SETUP //

const assestsPath = path.join(__dirname, 'public');
app.use(express.static(assestsPath));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// SESSION SETUP //

const store = new sessionStore({createTableIfMissing: true});

app.use(session({
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));


// PASSPORT SETUP //

app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(asyncHandler(async (id, done) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });

    if(!user){
        done(new Error('User not found'), null);
    }
    done(null, user);
}));

passport.use(
    new LocalStrategy(
        asyncHandler(async (username, password, done) => {
            const user = await prisma.user.findUnique({
                where: {
                    user_name: username
                }
            });
            if(!user){
                return done(null, false, {message: 'User not found'});
            }

            const match = await bcryptJs.compare(password, user.password);
            if(!match){
                return done(null, false, {message: 'Incorrect password'});
            }
            done(null, user);
        })
    )
);


// MAKE CURRENT USER AVAILABE TO ENTIRE APP //

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});


// ROUTES //

app.use( '/', indexRouter );
app.use( '/login', loginRouter );
app.use( '/signup', signupRouter );
app.use( '/folders', foldersRouter );
app.use('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
})

// SERVER STARTUP //

app.listen(process.env.PORT || 3000, () => {
    console.log('Server started.....');
});