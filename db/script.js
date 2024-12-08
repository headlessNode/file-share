const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    //queries
}

main()
    .catch(async (e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })