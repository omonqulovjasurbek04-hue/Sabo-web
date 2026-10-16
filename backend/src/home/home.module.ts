import { Module } from "@nestjs/common";
import { CmsCoreModule } from "../common/cms/cms-core.module";
import { HomeAdminController } from "./home-admin.controller";
import { HomeAdminService } from "./home-admin.service";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [CmsCoreModule],
  controllers: [HomeController, HomeAdminController],
  providers: [HomeService, HomeAdminService],
  exports: [HomeService],
})
export class HomeModule {}
