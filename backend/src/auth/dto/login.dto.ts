import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@sabo.uz', description: 'User email or phone' })
  @IsNotEmpty()
  @IsString()
  identifier!: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({ example: 'Chrome on Windows', description: 'Device description' })
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
