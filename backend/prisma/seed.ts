import { PrismaClient, RoleType, SettingType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const PERMISSIONS = [
  // Products
  { slug: 'products.read', name: 'View Products', module: 'products' },
  { slug: 'products.create', name: 'Create Products', module: 'products' },
  { slug: 'products.update', name: 'Update Products', module: 'products' },
  { slug: 'products.delete', name: 'Delete Products', module: 'products' },
  { slug: 'products.publish', name: 'Publish Products', module: 'products' },
  
  // Categories
  { slug: 'categories.read', name: 'View Categories', module: 'categories' },
  { slug: 'categories.manage', name: 'Manage Categories', module: 'categories' },

  // Media
  { slug: 'media.read', name: 'View Media', module: 'media' },
  { slug: 'media.manage', name: 'Manage Media', module: 'media' },

  // Orders
  { slug: 'orders.read', name: 'View Orders', module: 'orders' },
  { slug: 'orders.update', name: 'Update Order Status', module: 'orders' },
  { slug: 'orders.cancel', name: 'Cancel Orders', module: 'orders' },

  // Users & RBAC
  { slug: 'users.read', name: 'View Users', module: 'users' },
  { slug: 'users.update', name: 'Update Users', module: 'users' },
  { slug: 'users.roles', name: 'Manage User Roles', module: 'users' },

  // CMS Content
  { slug: 'blog.read', name: 'View Blog Posts', module: 'blog' },
  { slug: 'blog.create', name: 'Create Blog Posts', module: 'blog' },
  { slug: 'blog.update', name: 'Update Blog Posts', module: 'blog' },
  { slug: 'blog.publish', name: 'Publish Blog Posts', module: 'blog' },
  { slug: 'blog.delete', name: 'Delete Blog Posts', module: 'blog' },

  { slug: 'certificates.read', name: 'View Certificates', module: 'certificates' },
  { slug: 'certificates.manage', name: 'Manage Certificates', module: 'certificates' },

  { slug: 'production.manage', name: 'Manage Production CMS', module: 'production' },
  { slug: 'about.manage', name: 'Manage About CMS', module: 'about' },
  { slug: 'home.manage', name: 'Manage Home CMS', module: 'home' },

  // Contact
  { slug: 'contact.read', name: 'View Contact Messages', module: 'contact' },
  { slug: 'contact.manage', name: 'Manage Contact Status', module: 'contact' },

  // Settings & Audit
  { slug: 'settings.manage', name: 'Manage Site Settings', module: 'settings' },
  { slug: 'audit.read', name: 'View Audit Logs', module: 'audit' },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Roles
  console.log('👉 Seeding system roles...');
  const roles: Record<RoleType, any> = {} as any;
  for (const roleType of Object.values(RoleType)) {
    roles[roleType] = await prisma.role.upsert({
      where: { name: roleType },
      update: {},
      create: {
        name: roleType,
        description: `System role: ${roleType}`,
        isSystem: true,
      },
    });
  }

  // 2. Seed Permissions
  console.log('👉 Seeding granular permissions...');
  const createdPermissions: Record<string, any> = {};
  for (const perm of PERMISSIONS) {
    createdPermissions[perm.slug] = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { name: perm.name, module: perm.module },
      create: {
        slug: perm.slug,
        name: perm.name,
        module: perm.module,
      },
    });
  }

  // 3. Assign Permissions to Roles
  console.log('👉 Assigning permissions to roles...');
  
  // SUPER_ADMIN gets all permissions
  for (const perm of Object.values(createdPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.SUPER_ADMIN.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roles.SUPER_ADMIN.id,
        permissionId: perm.id,
      },
    });
  }

  // ADMIN gets all except role modification / advanced system settings if restricted
  for (const perm of Object.values(createdPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roles.ADMIN.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: roles.ADMIN.id,
        permissionId: perm.id,
      },
    });
  }

  // 4. Seed Default Site Settings
  console.log('👉 Seeding site settings...');
  const defaultSettings = [
    { key: 'site_name', value: 'SABO Dairy Platform', type: SettingType.STRING, isPublic: true },
    { key: 'default_locale', value: 'uz', type: SettingType.STRING, isPublic: true },
    { key: 'supported_locales', value: JSON.stringify(['uz', 'ru', 'en']), type: SettingType.JSON, isPublic: true },
    { key: 'ecommerce_enabled', value: 'true', type: SettingType.BOOLEAN, isPublic: true },
    { key: '3d_enabled', value: 'true', type: SettingType.BOOLEAN, isPublic: true },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type, isPublic: setting.isPublic },
      create: setting,
    });
  }

  // 5. Create Initial Super Admin if requested via ENV
  const adminEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const adminPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (adminEmail && adminPassword) {
    console.log(`👉 Bootstrapping Super Admin for ${adminEmail}...`);
    const passwordHash = await argon2.hash(adminPassword);
    const superAdmin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, isVerified: true, isActive: true },
      create: {
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        isVerified: true,
        isActive: true,
        locale: 'uz',
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: superAdmin.id,
          roleId: roles.SUPER_ADMIN.id,
        },
      },
      update: {},
      create: {
        userId: superAdmin.id,
        roleId: roles.SUPER_ADMIN.id,
      },
    });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
