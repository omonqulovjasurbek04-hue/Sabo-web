import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CMS_EDITOR_ROLES } from "../common/cms/cms.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CertificatesAdminService } from "./certificates-admin.service";
import {
  AdminCertificateQueryDto,
  CreateCertificateDto,
  UpdateCertificateDto,
} from "./dto/certificate-admin.dto";

@ApiTags("Admin / Certificates")
@ApiBearerAuth()
@Controller("admin/certificates")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...CMS_EDITOR_ROLES)
export class CertificatesAdminController {
  constructor(private readonly certificatesAdmin: CertificatesAdminService) {}

  @Get()
  @ApiOperation({ summary: "List certificates incl. inactive (Admin)" })
  async list(@Query() query: AdminCertificateQueryDto) {
    return this.certificatesAdmin.list(query);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get certificate (Admin)" })
  async get(@Param("id", ParseUUIDPipe) id: string) {
    return this.certificatesAdmin.get(id);
  }

  @Post()
  @ApiOperation({ summary: "Create certificate (starts inactive)" })
  async create(
    @Body() dto: CreateCertificateDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.certificatesAdmin.create(dto, userId);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update certificate (Admin)" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCertificateDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.certificatesAdmin.update(id, dto, userId);
  }

  @Post(":id/activate")
  @ApiOperation({
    summary: "Show certificate publicly (requires attached document)",
  })
  async activate(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.certificatesAdmin.setActive(id, true, userId);
  }

  @Post(":id/deactivate")
  @ApiOperation({ summary: "Hide / archive certificate (no hard delete)" })
  async deactivate(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.certificatesAdmin.setActive(id, false, userId);
  }
}
