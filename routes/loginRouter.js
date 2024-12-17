const {Router} = require('express');
const loginRouter = Router();
const loginController = require('../controllers/loginController.js');

loginRouter.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        loginController.renderLogin(req, res);
    } else {
        res.redirect('/');
    }
});

loginRouter.post('/', loginController.loginUser);

module.exports = loginRouter;