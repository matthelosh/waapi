const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

async function main() {
    const Token = await prisma.Token.upsert({
        where: {
            id: 'm4nd1t4'
        },
        update: {},
        create: {
            secret: '51m4nd1t4',
            key: 'f11c8f860d469fe0c5a6b7ae28e8192b8bdec3e9'
        }
    });

    console.log({Token})
}

main().then(async() => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
})
