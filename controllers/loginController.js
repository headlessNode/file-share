const asyncHandler = require('express-async-handler');
const passport = require('passport');


// CONTROLLER //

const loginController = {
    renderLogin: (req, res) => {
        res.render('login');
    },

    loginUser: asyncHandler(async (req, res, next) => {
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
                    } else {
                        res.redirect('/');
                    }
                })
            })(req, res, next)
        })
}

module.exports = loginController;