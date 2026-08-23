import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from "class-validator";
import {
  OrderStatus,
  PaymentProviderType,
  PaymentStatus,
} from "@prisma/client";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";

export class OrderAddressDto {
  @ApiProperty({ example: "Jasurbek Omonqulov" })
  @IsNotEmpty()
  @IsString()
  recipientName!: string;

  @ApiProperty({ example: "+998901234567" })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiPropertyOptional({ example: "Toshkent" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "Chilonzor" })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: "Bunyodkor ko'chasi 12-uy" })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: "45" })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiPropertyOptional({ example: "Eshik oldida qoldiring" })
  @IsOptional()
  @IsString()
  deliveryNote?: string;
}

export class OrderItemInputDto {
  @ApiProperty({ description: "Product Variant UUID" })
  @IsNotEmpty()
  @IsUUID()
  productVariantId!: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: "Jasurbek Omonqulov" })
  @IsNotEmpty()
  @IsString()
  customerName!: string;

  @ApiProperty({ example: "+998901234567" })
  @IsNotEmpty()
  @IsString()
  customerPhone!: string;

  @ApiPropertyOptional({ example: "customer@example.com" })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({ example: "Iltimos, soat 18:00 dan keyin yetkazing" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({
    enum: PaymentProviderType,
    default: PaymentProviderType.CASH,
  })
  @IsOptional()
  @IsEnum(PaymentProviderType)
  paymentProvider?: PaymentProviderType = PaymentProviderType.CASH;

  @ApiPropertyOptional({ type: OrderAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressDto)
  address?: OrderAddressDto;

  @ApiPropertyOptional({
    type: [OrderItemInputDto],
    description: "Optional if using cart items directly",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items?: OrderItemInputDto[];

  @ApiPropertyOptional({ description: "Cart ID to checkout from" })
  @IsOptional()
  @IsUUID()
  cartId?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}

export class OrderQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
