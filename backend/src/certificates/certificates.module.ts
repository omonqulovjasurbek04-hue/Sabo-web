import { Module } from "@nestjs/common";
import { CmsCoreModule } from "../common/cms/cms-core.module";
import { CertificatesAdminController } from "./certificates-admin.controller";
import { CertificatesAdminService } from "./certificates-admin.service";
import { CertificatesController } from "./certificates.controller";
import { CertificatesService } from "./certificates.service";

@Module({
  imports: [CmsCoreModule],
  controllers: [CertificatesController, CertificatesAdminController],
  providers: [CertificatesService, CertificatesAdminService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
