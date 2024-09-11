import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example: Add an initial user
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Admin User',
      avatar: '',
      coverImage: '',
      password: 'securepassword', // Consider hashing the password
    },
  });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
