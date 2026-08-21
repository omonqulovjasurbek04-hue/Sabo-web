import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderPricingService } from './services/order-pricing.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderPricingService],
  exports: [OrdersService, OrderPricingService],
})
export class OrdersModule {}
