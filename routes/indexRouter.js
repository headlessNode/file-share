const {Router} = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController.js');

indexRouter.get('/', (req, res) => {
    if(!req.isAuthenticated()) {
        res.redirect('/login');
    }
    indexController.renderIndex(req, res);
});

module.exports = indexRouter;