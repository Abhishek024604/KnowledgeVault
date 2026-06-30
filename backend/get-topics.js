const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ include: { topics: true } });
  console.log(JSON.stringify(user, null, 2));
}
main().finally(() => prisma.$disconnect());
