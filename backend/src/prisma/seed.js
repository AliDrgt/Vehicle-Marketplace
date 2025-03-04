"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createUser() {
    const newUser = await prisma.user.create({
        data: {
            email: 'tarnished@eldenring.com',
            password: 'runes1234', // In production, gonna use hash passwords!
            name: 'Tarnished One',
            phoneNumber: '+1234567890',
            role: 'USER',
            profilePicture: 'https://example.com/profile/tarnished.png',
        },
    });
    console.log('New user created:', newUser);
}
createUser()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    prisma.$disconnect();
});
