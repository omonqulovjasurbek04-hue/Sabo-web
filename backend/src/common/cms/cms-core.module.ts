import { Module } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { ContentChangeService } from "./content-change.service";

@Module({
  providers: [AuditService, ContentChangeService],
  exports: [AuditService, ContentChangeService],
})
export class CmsCoreModule {}
