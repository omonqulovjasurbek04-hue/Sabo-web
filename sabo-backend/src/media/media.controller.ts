import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard, Public } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.EDITOR, RoleType.MANAGER)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an image, PDF document or 3D asset' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', default: 'general' },
        altText: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'File uploaded successfully' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.mediaService.uploadFile(file, dto, userId);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get media metadata by ID' })
  async getMedia(@Param('id') id: string) {
    return this.mediaService.getMedia(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete media if not referenced in published content' })
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.deleteMedia(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.EDITOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List media library files' })
  async listMedia(
    @Query('folder') folder?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.mediaService.listMedia(folder, parseInt(page, 10), parseInt(limit, 10));
  }
}
