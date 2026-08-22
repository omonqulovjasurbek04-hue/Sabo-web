import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Jasurbek' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Omonqulov' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'uz' })
  @IsOptional()
  @IsString()
  locale?: string;
}

export class ChangePasswordDto {
  @ApiPropertyOptional({ example: 'OldPassword123!' })
  @IsString()
  @MinLength(6)
  oldPassword!: string;

  @ApiPropertyOptional({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(6)
  newPassword!: string;
}
