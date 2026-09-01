import { ApiProperty } from "@nestjs/swagger";
import { IsHexColor } from "class-validator";

export class ThemeModeColorsDto {
  @ApiProperty()
  @IsHexColor()
  primary!: string;

  @ApiProperty()
  @IsHexColor()
  primaryHover!: string;

  @ApiProperty()
  @IsHexColor()
  primarySoft!: string;

  @ApiProperty()
  @IsHexColor()
  secondary!: string;

  @ApiProperty()
  @IsHexColor()
  secondarySoft!: string;

  @ApiProperty()
  @IsHexColor()
  background!: string;

  @ApiProperty()
  @IsHexColor()
  surface!: string;

  @ApiProperty()
  @IsHexColor()
  surfaceElevated!: string;

  @ApiProperty()
  @IsHexColor()
  foreground!: string;

  @ApiProperty()
  @IsHexColor()
  muted!: string;

  @ApiProperty()
  @IsHexColor()
  border!: string;

  @ApiProperty()
  @IsHexColor()
  buttonBg!: string;

  @ApiProperty()
  @IsHexColor()
  buttonText!: string;

  @ApiProperty()
  @IsHexColor()
  buttonHover!: string;

  @ApiProperty()
  @IsHexColor()
  actionRed!: string;
}
