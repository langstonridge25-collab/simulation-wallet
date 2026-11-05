import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Setting up admin only...');

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !configuredPassword?.trim()) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin account.');
  }

  const adminPassword = await bcrypt.hash(configuredPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: Role.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Admin ready: ${adminEmail}`);
  console.log('Real users must register through the app.');
}

main().catch(console.error).finally(() => prisma.$disconnect());