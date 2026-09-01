import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port", 4000);
  const apiPrefix = configService.get<string>("app.apiPrefix", "api/v1");
  const origins = configService.get<string[]>("cors.origins", [
    "http://localhost:3000",
  ]);
  const nodeEnv = configService.get<string>("app.nodeEnv", "development");

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: nodeEnv === "production" ? undefined : false,
    }),
  );

  // 2. Strict CORS Configuration
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origins.includes(origin) ||
        nodeEnv === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Request-ID",
      "X-Session-ID",
      "Idempotency-Key",
    ],
  });

  // 3. Global API Versioning Prefix
  app.setGlobalPrefix(apiPrefix);

  // 4. Strict Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. Enable Graceful Shutdown Hooks
  app.enableShutdownHooks();

  // 6. Swagger OpenAPI Documentation
  if (nodeEnv !== "production" || process.env.ENABLE_SWAGGER === "true") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("🥛 SABO Dairy Platform API")
      .setDescription(
        "Production-ready, strongly typed, multilingual REST API for SABO Dairy website, admin dashboard, and future mobile applications.",
      )
      .setVersion("1.0.0")
      .addBearerAuth()
      .addTag("Auth", "Authentication, Registration, and Token Management")
      .addTag("Users", "User Profiles and Session Management")
      .addTag("Products", "Product Catalog, Details, and Translations")
      .addTag("Categories", "Hierarchical Product Categories")
      .addTag("Cart", "Guest and User Shopping Cart Management")
      .addTag("Orders", "Transactional Checkout and Order Tracking")
      .addTag("Payments", "Payment Gateway Integration (Click / Payme / Cash)")
      .addTag("Media", "S3/MinIO Object Storage & Asset Management")
      .addTag("Home", "Cached Homepage Aggregated CMS Content")
      .addTag("Production", "Production Process Steps and Quality CMS")
      .addTag("About", "About Company, Timelines, Values and Team CMS")
      .addTag(
        "Certificates",
        "Official ISO / HACCP / Halal Verification Documents",
      )
      .addTag("Blog", "Articles, News, and Recipes")
      .addTag("Contact", "Spam-Protected Contact Form and Company Info")
      .addTag("Admin", "Administrator Operations and Real Aggregated Metrics")
      .addTag("Health", "Application and Database Liveness/Readiness")
      .addTag("Settings", "Site-wide Theme and Color Customization Settings")
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
    logger.log(
      `📚 Swagger documentation available at http://localhost:${port}/docs`,
    );
  }

  // 7. Root Redirect to Frontend
  const frontendUrl = configService.get<string>(
    "cors.frontendUrl",
    "http://localhost:3000",
  );
  app.getHttpAdapter().getInstance().get("/", (req: any, res: any) => {
    res.redirect(frontendUrl);
  });

  await app.listen(port, "0.0.0.0");
  logger.log(
    `🚀 SABO Backend API running on http://0.0.0.0:${port}/${apiPrefix}`,
  );
}

bootstrap().catch((err) => {
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});
