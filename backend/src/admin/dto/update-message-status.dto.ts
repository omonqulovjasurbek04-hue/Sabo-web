import { ApiProperty } from "@nestjs/swagger";
import { ContactMessageStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateMessageStatusDto {
  @ApiProperty({ enum: ContactMessageStatus })
  @IsNotEmpty()
  @IsEnum(ContactMessageStatus)
  status!: ContactMessageStatus;
}
