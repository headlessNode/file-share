const {body, validationResult} = require('express-validator');
const {PrismaClient} = require('@prisma/client');
const asyncHandler = require('async-handler');
const passport = require('passport');


// VALIDATION //

const validateUsername = [
    body('username').notEmpty().withMessage('Username is required'),
];

const validatePassword = [
    body('password').notEmpty().withMessage('Password is required'),
];

// CONTROLLER //

const loginController = {
    renderLogin: (req, res) => {
        res.render('login');
    },

    loginUser: [
        validateUsername,
        validatePassword,
        asyncHandler(async (req, res, next) => {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                res.render('login', {errors: errors.array()});
            } else {
                passport.authenticate('local', (err, user, info) => {
                    if(err) {
                        next(err);
                    }
                    if(!user){
                        res.render('login', {errors: [info.message]});
                    }
                    req.logIn(user, (err) => {
                        if(err){
                            next(err);
                        }
                        res.redirect('/');
                    })
                })(req, res, next)
            }
        })
    ]

}

module.exports = loginController;