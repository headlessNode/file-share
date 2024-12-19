const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const foldersController = {
    renderFolders: async (req, res) => {
        const user = res.locals.user;
        const folders = await prisma.folder.findMany({where: {user_id: user.id}});
        res.render('folders', {user: user, folders: folders});
    },

    deleteFolder: async (req, res) => {
        const folderId = parseInt( req.params.folderId, 10 );
        await prisma.folder.delete({where: {id: folderId}});
        res.redirect('/');
    }
}

module.exports = foldersController;