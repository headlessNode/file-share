
const indexController = {
    renderIndex: (req, res) => {
        res.render('index', {user: res.locals.user});
    }
};

module.exports = indexController;