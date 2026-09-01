import {
  AvailabilityStatus,
  PrismaClient,
  ProductImageType,
  ProductStatus,
  RoleType,
  SettingType,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

type LocaleText = { uz: string; ru: string; en: string };
const LOCALES = ['uz', 'ru', 'en'] as const;

interface CategorySeed {
  slug: string;
  name: LocaleText;
  description: LocaleText;
}

interface NutritionSeed {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  calcium: number;
  sugar: number;
}

interface StorageSeed {
  temperatureMin: number;
  temperatureMax: number;
  shelfLife: LocaleText;
  storageText: LocaleText;
}

interface ProductSeed {
  slug: string;
  categorySlug: string;
  isFeatured: boolean;
  name: LocaleText;
  description: LocaleText;
  images: string[];
  volumes: string[];
  price: number;
  nutrition?: NutritionSeed;
  storage?: StorageSeed;
}

const CATEGORIES: CategorySeed[] = [
  {
    slug: 'milk',
    name: { uz: 'Sut', ru: 'Молоко', en: 'Milk' },
    description: {
      uz: 'Tabiiy sigir suti',
      ru: 'Натуральное коровье молоко',
      en: 'Natural cow milk',
    },
  },
  {
    slug: 'kefir',
    name: { uz: 'Kefir', ru: 'Кефир', en: 'Kefir' },
    description: {
      uz: 'Toza va foydali kefir',
      ru: 'Чистый и полезный кефир',
      en: 'Clean and healthy kefir',
    },
  },
  {
    slug: 'yogurt',
    name: { uz: 'Yogurt', ru: 'Йогурт', en: 'Yogurt' },
    description: {
      uz: 'Yumshoq va mazali yogurt',
      ru: 'Нежный и вкусный йогурт',
      en: 'Soft and tasty yogurt',
    },
  },
  {
    slug: 'sour-cream',
    name: { uz: 'Qaymoq (smetana)', ru: 'Сметана', en: 'Sour cream' },
    description: {
      uz: 'Qaymoq mahsulotlari',
      ru: 'Сметанные продукты',
      en: 'Sour cream products',
    },
  },
  {
    slug: 'cream',
    name: { uz: 'Qaymoq (krem)', ru: 'Сливки', en: 'Cream' },
    description: {
      uz: 'Yumshoq qaymoq',
      ru: 'Нежные сливки',
      en: 'Smooth cream',
    },
  },
  {
    slug: 'butter',
    name: { uz: "Sariyog'", ru: 'Сливочное масло', en: 'Butter' },
    description: {
      uz: "Tabiiy sariyog'",
      ru: 'Натуральное сливочное масло',
      en: 'Natural butter',
    },
  },
  {
    slug: 'other',
    name: { uz: 'Boshqa', ru: 'Другие', en: 'Other' },
    description: {
      uz: 'Boshqa sut mahsulotlari',
      ru: 'Другие молочные продукты',
      en: 'Other dairy products',
    },
  },
];

const PRODUCTS: ProductSeed[] = [
  {
    slug: 'sabo-sut-3-2-1l',
    categorySlug: 'milk',
    isFeatured: true,
    name: {
      uz: 'SABO Sut 3.2%',
      ru: 'SABO Молоко 3.2%',
      en: 'SABO Milk 3.2%',
    },
    description: {
      uz: "Tabiiy va toza sigir suti. Yangi sog'ilgan sutning tabiiy ta'mi va foydali moddalari to'liq saqlangan.",
      ru: 'Натуральное отборное коровье молоко. Сохранен натуральный вкус и польза свежего молока.',
      en: 'Natural premium cow milk. Preserved natural fresh taste and rich nutrients.',
    },
    images: [
      '/images/products/Sabo_Milk.jpg',
      '/images/photo_2026-08-20_02-35-47.jpg',
      '/images/photo_2026-08-20_02-36-37.jpg',
      '/images/photo_2026-08-20_02-38-16.jpg',
    ],
    volumes: ['1 L', '1.5 L'],
    price: 13000,
    nutrition: {
      calories: 60,
      protein: 3.0,
      fat: 3.2,
      carbohydrates: 4.7,
      calcium: 120,
      sugar: 4.6,
    },
    storage: {
      temperatureMin: 2,
      temperatureMax: 6,
      shelfLife: { uz: '10 kun', ru: '10 дней', en: '10 days' },
      storageText: {
        uz: "Muzlatgichda saqlansin. Qadoq ochilgach 48 soatda iste'mol qiling.",
        ru: 'Хранить в холодильнике. После вскрытия употребить за 48 часов.',
        en: 'Store refrigerated. Consume within 48h after opening.',
      },
    },
  },
  {
    slug: 'sabo-sutim-1l',
    categorySlug: 'milk',
    isFeatured: true,
    name: {
      uz: 'SABO Sutim 2.5%',
      ru: 'SABO Sutim 2.5%',
      en: 'SABO Sutim 2.5%',
    },
    description: {
      uz: "Kundalik iste'mol uchun yengil va to'yimli tabiiy sut.",
      ru: 'Легкое и питательное натуральное молоко для ежедневного употребления.',
      en: 'Light and nutritious fresh milk for daily family enjoyment.',
    },
    images: [
      '/images/products/SaboSutim.jpg',
      '/images/photo_2026-08-20_02-36-40.jpg',
      '/images/photo_2026-08-20_02-38-18.jpg',
    ],
    volumes: ['1 L'],
    price: 11500,
    nutrition: {
      calories: 52,
      protein: 2.9,
      fat: 2.5,
      carbohydrates: 4.7,
      calcium: 115,
      sugar: 4.5,
    },
  },
  {
    slug: 'sabo-kefir-1l',
    categorySlug: 'kefir',
    isFeatured: true,
    name: { uz: 'SABO Kefir 1L', ru: 'SABO Кефир 1L', en: 'SABO Kefir 1L' },
    description: {
      uz: "Tabiiy tirik achitqi asosida tayyorlangan yumshoq va to'yimli kefir.",
      ru: 'Нежный и полезный кефир на натуральной живой закваске.',
      en: 'Smooth and nutritious kefir made with natural live culture.',
    },
    images: [
      '/images/products/Sabo_Kefir.jpg',
      '/images/products/Sabo_Kefir_05.jpg',
      '/images/photo_2026-08-20_02-38-22.jpg',
    ],
    volumes: ['1 L'],
    price: 13500,
    nutrition: {
      calories: 56,
      protein: 3.1,
      fat: 3.2,
      carbohydrates: 4.0,
      calcium: 130,
      sugar: 3.8,
    },
  },
  {
    slug: 'sabo-kefir-05l',
    categorySlug: 'kefir',
    isFeatured: false,
    name: {
      uz: 'SABO Kefir 0.5L',
      ru: 'SABO Кефир 0.5L',
      en: 'SABO Kefir 0.5L',
    },
    description: {
      uz: 'Qulay ixcham hajmda tabiiy va sogʻlom kefir.',
      ru: 'Натуральный полезный кефир в удобном компактном формате.',
      en: 'Pure healthy kefir in a convenient on-the-go bottle.',
    },
    images: [
      '/images/products/Sabo_Kefir_05.jpg',
      '/images/products/Sabo_Kefir.jpg',
      '/images/photo_2026-08-20_02-38-28.jpg',
    ],
    volumes: ['0.5 L'],
    price: 8000,
  },
  {
    slug: 'sabo-yogurt-450g',
    categorySlug: 'yogurt',
    isFeatured: false,
    name: { uz: 'SABO Yogurt', ru: 'SABO Йогурт', en: 'SABO Yogurt' },
    description: {
      uz: 'Yumshoq va tabiiy yogurt, butun oila uchun foydali va lazzatli.',
      ru: 'Нежный натуральный йогурт, полезный и вкусный для всей семьи.',
      en: 'Smooth natural yogurt, healthy and delicious for the whole family.',
    },
    images: [
      '/images/products/Sabo_Yogurt.jpg',
      '/images/photo_2026-08-20_02-38-45.jpg',
      '/images/photo_2026-08-20_02-39-21.jpg',
    ],
    volumes: ['450 g'],
    price: 14000,
    nutrition: {
      calories: 68,
      protein: 3.4,
      fat: 2.5,
      carbohydrates: 6.2,
      calcium: 125,
      sugar: 5.0,
    },
  },
  {
    slug: 'sabo-smetana-400g',
    categorySlug: 'sour-cream',
    isFeatured: false,
    name: {
      uz: 'SABO Smetana 20%',
      ru: 'SABO Сметана 20%',
      en: 'SABO Sour Cream 20%',
    },
    description: {
      uz: "Quyuq va mayin smetana, tabiiy qaymoqdan an'anaviy usulda tayyorlangan.",
      ru: 'Густая и нежная сметана из натуральных свежих сливок.',
      en: 'Rich and creamy smetana crafted from fresh natural cream.',
    },
    images: [
      '/images/products/Sabo_Smetana.jpg',
      '/images/photo_2026-08-20_02-39-25.jpg',
      '/images/photo_2026-08-20_02-39-28.jpg',
    ],
    volumes: ['400 g'],
    price: 17000,
    nutrition: {
      calories: 206,
      protein: 2.5,
      fat: 20.0,
      carbohydrates: 3.4,
      calcium: 90,
      sugar: 3.2,
    },
  },
  {
    slug: 'sabo-qaymoq-400g',
    categorySlug: 'cream',
    isFeatured: false,
    name: {
      uz: 'SABO Qaymoq',
      ru: 'SABO Сливки / Каймак',
      en: 'SABO Cream / Qaymoq',
    },
    description: {
      uz: "Tabiiy sut qaymog'i — haqiqiy milliy lazzat va boy ta'm.",
      ru: 'Натуральные сливки (каймак) с традиционным богатым вкусом.',
      en: 'Pure natural cream (qaymoq) with authentic rich traditional flavor.',
    },
    images: [
      '/images/products/Sabo_Qaymoq.jpg',
      '/images/photo_2026-08-20_02-39-38.jpg',
      '/images/photo_2026-08-20_02-39-41.jpg',
    ],
    volumes: ['400 g'],
    price: 24000,
    nutrition: {
      calories: 335,
      protein: 2.2,
      fat: 35.0,
      carbohydrates: 2.8,
      calcium: 80,
      sugar: 2.6,
    },
  },
];

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

  // 5. Seed Product Categories
  console.log('👉 Seeding product categories...');
  const categoryMap: Record<string, any> = {};
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name.uz,
        description: cat.description.uz,
        isActive: true,
      },
      create: {
        slug: cat.slug,
        name: cat.name.uz,
        description: cat.description.uz,
        isActive: true,
      },
    });
    categoryMap[cat.slug] = category;

    for (const locale of LOCALES) {
      await prisma.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: category.id, locale } },
        update: {
          name: cat.name[locale],
          description: cat.description[locale],
        },
        create: {
          categoryId: category.id,
          locale,
          name: cat.name[locale],
          description: cat.description[locale],
        },
      });
    }
  }

  // 6. Seed Products (translations, images, variants, nutrition, storage, availability)
  console.log('👉 Seeding products...');
  for (const p of PRODUCTS) {
    const category = categoryMap[p.categorySlug];

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name.uz,
        description: p.description.uz,
        categoryId: category?.id,
        brand: 'SABO',
        status: ProductStatus.ACTIVE,
        isActive: true,
        isFeatured: p.isFeatured,
        publishedAt: new Date(),
      },
      create: {
        slug: p.slug,
        name: p.name.uz,
        description: p.description.uz,
        categoryId: category?.id,
        brand: 'SABO',
        status: ProductStatus.ACTIVE,
        isActive: true,
        isFeatured: p.isFeatured,
        publishedAt: new Date(),
      },
    });

    // Translations (full i18n fidelity, including storage text where available)
    for (const locale of LOCALES) {
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale } },
        update: {
          name: p.name[locale],
          description: p.description[locale],
          storageText: p.storage?.storageText[locale],
        },
        create: {
          productId: product.id,
          locale,
          name: p.name[locale],
          description: p.description[locale],
          storageText: p.storage?.storageText[locale],
        },
      });
    }

    // Media + ProductImage (first image = primary/main)
    for (let i = 0; i < p.images.length; i++) {
      const imagePath = p.images[i];
      const fileName = imagePath.split('/').pop() as string;

      const media = await prisma.media.upsert({
        where: { storageKey: imagePath },
        update: {
          fileName,
          originalName: fileName,
          url: imagePath,
        },
        create: {
          fileName,
          originalName: fileName,
          mimeType: 'image/jpeg',
          size: 0,
          storageKey: imagePath,
          url: imagePath,
          folder: 'products',
        },
      });

      const existingImage = await prisma.productImage.findFirst({
        where: { productId: product.id, mediaId: media.id },
      });

      const imageData = {
        type: i === 0 ? ProductImageType.PRIMARY : ProductImageType.GALLERY,
        isPrimary: i === 0,
        sortOrder: i,
      };

      if (existingImage) {
        await prisma.productImage.update({
          where: { id: existingImage.id },
          data: imageData,
        });
      } else {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            mediaId: media.id,
            ...imageData,
          },
        });
      }
    }

    // Variants (one per volume, same price for every volume)
    for (let i = 0; i < p.volumes.length; i++) {
      const volume = p.volumes[i];
      const variantData = {
        name: `${p.name.uz} ${volume}`,
        volume,
        priceMinor: p.price * 100,
        currency: 'UZS',
        stock: 100,
        isAvailable: true,
        isDefault: i === 0,
      };

      const existingVariant = await prisma.productVariant.findFirst({
        where: { productId: product.id, volume },
      });

      if (existingVariant) {
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: variantData,
        });
      } else {
        await prisma.productVariant.create({
          data: { productId: product.id, ...variantData },
        });
      }
    }

    // Nutrition (calcium goes into additionalData since there's no dedicated column)
    if (p.nutrition) {
      const nutritionData = {
        calories: p.nutrition.calories,
        protein: p.nutrition.protein,
        fat: p.nutrition.fat,
        carbohydrates: p.nutrition.carbohydrates,
        sugar: p.nutrition.sugar,
        additionalData: { calcium: p.nutrition.calcium },
      };
      await prisma.productNutrition.upsert({
        where: { productId: product.id },
        update: nutritionData,
        create: { productId: product.id, ...nutritionData },
      });
    }

    // Storage (base columns use uz text; per-locale text also stored on ProductTranslation above)
    if (p.storage) {
      const storageData = {
        temperatureMin: p.storage.temperatureMin,
        temperatureMax: p.storage.temperatureMax,
        shelfLife: p.storage.shelfLife.uz,
        storageText: p.storage.storageText.uz,
      };
      await prisma.productStorage.upsert({
        where: { productId: product.id },
        update: storageData,
        create: { productId: product.id, ...storageData },
      });
    }

    // Availability
    await prisma.productAvailability.upsert({
      where: { productId: product.id },
      update: { status: AvailabilityStatus.AVAILABLE, stock: 100 },
      create: {
        productId: product.id,
        status: AvailabilityStatus.AVAILABLE,
        stock: 100,
      },
    });
  }

  // 7. Create Initial Super Admin if requested via ENV
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
