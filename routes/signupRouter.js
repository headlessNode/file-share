const {Router} = require('express');
const signupRouter = Router();
const signupController = require('../controllers/signupController.js');

signupRouter.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        signupController.renderSignup(req, res);
    } else {
        res.redirect('/');
    }
});

signupRouter.post('/', signupController.signup);

module.exports = signupRouter;