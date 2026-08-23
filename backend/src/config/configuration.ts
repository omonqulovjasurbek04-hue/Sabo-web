export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseInt(process.env.PORT || "4000", 10),
    apiPrefix: process.env.API_PREFIX || "api/v1",
    appName: process.env.APP_NAME || "SABO-API",
    defaultLocale: process.env.DEFAULT_LOCALE || "uz",
    supportedLocales: (process.env.SUPPORTED_LOCALES || "uz,ru,en").split(","),
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || "redis://localhost:6379",
  },
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET || "dev_secret_access_key_min_32_chars_123",
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      "dev_secret_refresh_key_min_32_chars_123",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    origins: (
      process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:3001"
    ).split(","),
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT || "http://localhost:9000",
    region: process.env.S3_REGION || "us-east-1",
    bucket: process.env.S3_BUCKET || "sabo-media",
    accessKey: process.env.S3_ACCESS_KEY || "minioadmin",
    secretKey: process.env.S3_SECRET_KEY || "minioadmin",
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    publicUrl: process.env.S3_PUBLIC_URL || "http://localhost:9000/sabo-media",
  },
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "1025", 10),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
    from: process.env.EMAIL_FROM || "SABO Dairy <noreply@sabo.uz>",
  },
  payments: {
    click: {
      apiUrl: process.env.CLICK_API_URL || "https://api.click.uz/v2/merchant",
      merchantId: process.env.CLICK_MERCHANT_ID || "",
      serviceId: process.env.CLICK_SERVICE_ID || "",
      secret: process.env.CLICK_SECRET || "",
    },
    payme: {
      apiUrl: process.env.PAYME_API_URL || "https://checkout.paycom.uz/api",
      merchantId: process.env.PAYME_MERCHANT_ID || "",
      secret: process.env.PAYME_SECRET || "",
    },
  },
  features: {
    ecommerce: process.env.ECOMMERCE_ENABLED !== "false",
    cart: process.env.CART_ENABLED !== "false",
    checkout: process.env.CHECKOUT_ENABLED !== "false",
    payments: process.env.PAYMENTS_ENABLED !== "false",
    blog: process.env.BLOG_ENABLED !== "false",
    registration: process.env.REGISTRATION_ENABLED !== "false",
    threeD: process.env.THREE_D_ENABLED !== "false",
  },
});
