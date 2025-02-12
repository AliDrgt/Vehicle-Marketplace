"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function deleteUser() {
    const deletedUser = await prisma.user.deleteMany({
        where: {
            email: 'tarnished@eldenring.com',
        },
    });
    console.log(`${deletedUser.count} user(s) deleted.`);
}
deleteUser()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
