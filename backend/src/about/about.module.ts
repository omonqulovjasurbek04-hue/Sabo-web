import { Module } from "@nestjs/common";
import { CmsCoreModule } from "../common/cms/cms-core.module";
import { AboutAdminController } from "./about-admin.controller";
import { AboutAdminService } from "./about-admin.service";
import { AboutController } from "./about.controller";
import { AboutService } from "./about.service";

@Module({
  imports: [CmsCoreModule],
  controllers: [AboutController, AboutAdminController],
  providers: [AboutService, AboutAdminService],
  exports: [AboutService],
})
export class AboutModule {}
