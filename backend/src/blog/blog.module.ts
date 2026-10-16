import { Module } from "@nestjs/common";
import { CmsCoreModule } from "../common/cms/cms-core.module";
import { BlogAdminController } from "./blog-admin.controller";
import { BlogAdminService } from "./blog-admin.service";
import { BlogController } from "./blog.controller";
import { BlogService } from "./blog.service";

@Module({
  imports: [CmsCoreModule],
  controllers: [BlogController, BlogAdminController],
  providers: [BlogService, BlogAdminService],
  exports: [BlogService],
})
export class BlogModule {}
