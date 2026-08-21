import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Jasurbek' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'client@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  email?: string;

  @ApiProperty({ example: 'Mahsulotlar bo\'yicha savolim bor edi...' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  message!: string;

  // Honeypot field for anti-bot protection (must be empty from real humans)
  @IsOptional()
  @IsString()
  websiteUrl?: string;
}
