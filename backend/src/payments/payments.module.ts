import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { ClickPaymentProvider } from "./providers/click-payment.provider";
import { PaymePaymentProvider } from "./providers/payme-payment.provider";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, ClickPaymentProvider, PaymePaymentProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
