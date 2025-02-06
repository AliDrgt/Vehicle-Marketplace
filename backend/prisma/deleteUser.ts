import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
