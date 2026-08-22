import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @ApiPropertyOptional({ example: 'products', description: 'Folder name' })
  @IsOptional()
  @IsString()
  folder?: string = 'general';

  @ApiPropertyOptional({ example: 'SABO Kefir 1L Packaging', description: 'Alternative text for accessibility' })
  @IsOptional()
  @IsString()
  altText?: string;
}
