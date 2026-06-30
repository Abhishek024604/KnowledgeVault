const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ include: { entries: { take: 3, orderBy: { createdAt: 'desc' }, include: { tags: true } } } });
  console.log(JSON.stringify(user, null, 2));
}
main().finally(() => prisma.$disconnect());
