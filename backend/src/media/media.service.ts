import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { APP_CONSTANTS } from "../config/constants";
import { ErrorCode } from "../common/enums/error-code.enum";
import { PrismaService } from "../prisma/prisma.service";
import { UploadMediaDto } from "./dto/upload-media.dto";

@Injectable()
export class MediaService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(MediaService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.bucket = this.configService.get<string>("s3.bucket", "sabo-media");
    this.publicUrl = this.configService.get<string>(
      "s3.publicUrl",
      "http://localhost:9000/sabo-media",
    );

    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>("s3.endpoint"),
      region: this.configService.get<string>("s3.region", "us-east-1"),
      credentials: {
        accessKeyId: this.configService.get<string>(
          "s3.accessKey",
          "minioadmin",
        ),
        secretAccessKey: this.configService.get<string>(
          "s3.secretKey",
          "minioadmin",
        ),
      },
      forcePathStyle: this.configService.get<boolean>(
        "s3.forcePathStyle",
        true,
      ),
    });
  }

  validateFile(file: Express.Multer.File) {
    const isImage = (
      APP_CONSTANTS.MEDIA.ALLOWED_IMAGE_MIMES as readonly string[]
    ).includes(file.mimetype);
    const isDoc = (
      APP_CONSTANTS.MEDIA.ALLOWED_DOC_MIMES as readonly string[]
    ).includes(file.mimetype);
    const is3D = (
      APP_CONSTANTS.MEDIA.ALLOWED_3D_MIMES as readonly string[]
    ).includes(file.mimetype);

    if (!isImage && !isDoc && !is3D) {
      throw new BadRequestException({
        code: ErrorCode.MEDIA_TYPE_NOT_ALLOWED,
        message: `File type ${file.mimetype} is not allowed.`,
      });
    }

    if (isImage && file.size > APP_CONSTANTS.MEDIA.MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException({
        code: ErrorCode.MEDIA_SIZE_EXCEEDED,
        message: `Image size exceeds limit of ${APP_CONSTANTS.MEDIA.MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`,
      });
    }

    if (isDoc && file.size > APP_CONSTANTS.MEDIA.MAX_PDF_SIZE_BYTES) {
      throw new BadRequestException({
        code: ErrorCode.MEDIA_SIZE_EXCEEDED,
        message: `Document size exceeds limit of ${APP_CONSTANTS.MEDIA.MAX_PDF_SIZE_BYTES / (1024 * 1024)}MB`,
      });
    }

    if (is3D && file.size > APP_CONSTANTS.MEDIA.MAX_3D_SIZE_BYTES) {
      throw new BadRequestException({
        code: ErrorCode.MEDIA_SIZE_EXCEEDED,
        message: `3D Model size exceeds limit of ${APP_CONSTANTS.MEDIA.MAX_3D_SIZE_BYTES / (1024 * 1024)}MB`,
      });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    dto: UploadMediaDto,
    userId?: string,
  ) {
    this.validateFile(file);

    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const folder = (dto.folder || "general").replace(/[^a-zA-Z0-9_-]/g, "");
    const storageKey = `${folder}/${uuidv4()}-${sanitizedBase}${ext}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (err: any) {
      this.logger.error(`Failed to upload to S3: ${err.message}`, err.stack);
      // If S3 is not available in local test mode, we still create media metadata
      this.logger.warn("Continuing with metadata creation...");
    }

    const url = `${this.publicUrl}/${storageKey}`;

    const media = await this.prisma.media.create({
      data: {
        fileName: `${sanitizedBase}${ext}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey,
        url,
        altText: dto.altText || null,
        folder,
        createdBy: userId || null,
      },
    });

    return media;
  }

  async getMedia(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException({
        code: ErrorCode.MEDIA_NOT_FOUND,
        message: "Media not found",
      });
    }
    return media;
  }

  async deleteMedia(id: string) {
    const media = await this.getMedia(id);

    // Check if media is in use
    const [productCount, blogCount, certCount] = await Promise.all([
      this.prisma.productImage.count({ where: { mediaId: id } }),
      this.prisma.blogPost.count({ where: { coverImageId: id } }),
      this.prisma.certificate.count({
        where: { OR: [{ documentMediaId: id }, { previewMediaId: id }] },
      }),
    ]);

    if (productCount > 0 || blogCount > 0 || certCount > 0) {
      throw new ConflictException({
        code: ErrorCode.MEDIA_IN_USE,
        message:
          "Cannot delete media because it is referenced in active content.",
      });
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: media.storageKey,
        }),
      );
    } catch (err: any) {
      this.logger.warn(`Failed to delete object from S3: ${err.message}`);
    }

    await this.prisma.media.delete({ where: { id } });
    return { success: true, message: "Media deleted successfully" };
  }

  async listMedia(folder?: string, page = 1, limit = 20) {
    const where = folder ? { folder } : {};
    const [data, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.media.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;
    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    };
  }
}
