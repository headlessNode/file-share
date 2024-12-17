const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const foldersController = {
    renderFolders: async (req, res) => {
        const user = res.locals.user;
        const folders = await prisma.folder.findMany({where: {user_id: user.id}});
        res.render('folders', {user: user, folders: folders});
    },
}

module.exports = foldersController;