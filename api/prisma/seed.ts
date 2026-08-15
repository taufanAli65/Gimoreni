import { PrismaClient, Role } from '@prisma/client';
import { supabaseAdmin } from '../src/config/supabase';
import { env } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD;

  console.log(`Checking for existing admin user with email: ${adminEmail}`);

  // Check if admin already exists in DB
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists in database. Skipping.');
    return;
  }

  // Create or get user in Supabase Auth
  console.log('Creating admin user in Supabase Auth...');
  
  let supabaseUserId = '';
  
  try {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes('already been registered') || authError.status === 422) {
        console.log('User already exists in Supabase Auth. Fetching user ID...');
        
        const { data: usersData, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (fetchError) {
          throw new Error(`Failed to list Supabase users: ${fetchError.message}`);
        }
        
        const user = usersData.users.find(u => u.email === adminEmail);
        if (!user) {
          throw new Error('User exists in Supabase but could not be found in list.');
        }
        
        supabaseUserId = user.id;
      } else {
        throw new Error(`Failed to create Supabase user: ${authError.message}`);
      }
    } else {
      supabaseUserId = authData.user.id;
    }
  } catch (err: any) {
    if (err.message?.includes('fetch failed')) {
      console.warn('⚠️ Supabase connection failed. Are you running locally without Supabase Auth?');
      console.warn('⚠️ Falling back to a mock Supabase ID for database seeding.');
      supabaseUserId = 'mock-supabase-id-admin';
    } else {
      throw err;
    }
  }

  // Create user in Prisma
  console.log('Creating admin user in database...');
  
  await prisma.user.create({
    data: {
      supabaseUserId,
      email: adminEmail,
      name: 'System Administrator',
      role: Role.ADMIN,
      hasCompletedTutorial: true,
    },
  });

  console.log('✅ Admin user created successfully!');
  console.log('🌱 Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
