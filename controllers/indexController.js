const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const indexController = {
    renderIndex: async (req, res) => {
        const user = res.locals.user;
        const folders = await prisma.folder.findMany({where: {user_id: user.id}});
        const files = await prisma.file.findMany({where: {user_id: user.id}});
        res.render('index', {user: user, folders: folders, files: files});
    },

    createFolder: async (req, res) => {
        const user = res.locals.user;
        const {folder} = req.body;
        await prisma.folder.create({
            data: {
                name: folder,
                user_id: user.id
            }
        });
        res.redirect('/');
    }

};

module.exports = indexController;