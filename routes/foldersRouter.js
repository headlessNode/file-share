const {Router} = require('express');
const foldersRouter = Router();
const foldersController = require('../controllers/foldersController.js');

foldersRouter.get( '/', foldersController.renderFolders );
foldersRouter.post( '/', foldersController.createFolder );

module.exports = foldersRouter;