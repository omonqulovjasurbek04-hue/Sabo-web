export const APP_CONSTANTS = {
  DEFAULT_LOCALE: 'uz',
  SUPPORTED_LOCALES: ['uz', 'ru', 'en'] as const,
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
  },
  RATE_LIMITS: {
    GLOBAL_TTL: 60 * 1000, // 1 minute
    GLOBAL_LIMIT: 120, // 120 requests per minute
    AUTH_TTL: 15 * 60 * 1000, // 15 minutes
    AUTH_LIMIT: 5, // 5 attempts per 15 minutes
    CONTACT_TTL: 60 * 60 * 1000, // 1 hour
    CONTACT_LIMIT: 5,
  },
  MEDIA: {
    MAX_IMAGE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
    MAX_PDF_SIZE_BYTES: 25 * 1024 * 1024, // 25MB
    MAX_3D_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
    ALLOWED_IMAGE_MIMES: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'],
    ALLOWED_DOC_MIMES: ['application/pdf'],
    ALLOWED_3D_MIMES: ['model/gltf-binary', 'model/gltf+json', 'application/octet-stream'],
  },
} as const;

export type SupportedLocale = (typeof APP_CONSTANTS.SUPPORTED_LOCALES)[number];
