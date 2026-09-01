import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ThemeModeColorsDto {
  @ApiProperty()
  @IsString()
  primary!: string;

  @ApiProperty()
  @IsString()
  primaryHover!: string;

  @ApiProperty()
  @IsString()
  primarySoft!: string;

  @ApiProperty()
  @IsString()
  secondary!: string;

  @ApiProperty()
  @IsString()
  secondarySoft!: string;

  @ApiProperty()
  @IsString()
  background!: string;

  @ApiProperty()
  @IsString()
  surface!: string;

  @ApiProperty()
  @IsString()
  surfaceElevated!: string;

  @ApiProperty()
  @IsString()
  foreground!: string;

  @ApiProperty()
  @IsString()
  muted!: string;

  @ApiProperty()
  @IsString()
  border!: string;

  @ApiProperty()
  @IsString()
  buttonBg!: string;

  @ApiProperty()
  @IsString()
  buttonText!: string;

  @ApiProperty()
  @IsString()
  buttonHover!: string;

  @ApiProperty()
  @IsString()
  actionRed!: string;
}
