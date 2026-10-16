import { Module } from "@nestjs/common";
import { CmsCoreModule } from "../common/cms/cms-core.module";
import { ProductionAdminController } from "./production-admin.controller";
import { ProductionAdminService } from "./production-admin.service";
import { ProductionController } from "./production.controller";
import { ProductionService } from "./production.service";

@Module({
  imports: [CmsCoreModule],
  controllers: [ProductionController, ProductionAdminController],
  providers: [ProductionService, ProductionAdminService],
  exports: [ProductionService],
})
export class ProductionModule {}
