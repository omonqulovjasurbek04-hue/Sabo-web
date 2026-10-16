import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpsertCmsPageDto } from "../common/cms/cms-page.dto";
import { CMS_EDITOR_ROLES, PAGE_STATUS } from "../common/cms/cms.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  CreateProductionStepDto,
  UpdateProductionStepDto,
} from "./dto/production-admin.dto";
import { ProductionAdminService } from "./production-admin.service";

@ApiTags("Admin / Production")
@ApiBearerAuth()
@Controller("admin/production")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...CMS_EDITOR_ROLES)
export class ProductionAdminController {
  constructor(private readonly productionAdmin: ProductionAdminService) {}

  @Get()
  @ApiOperation({ summary: "Get production page (any status) with steps" })
  async getPage() {
    return this.productionAdmin.getPage();
  }

  @Put()
  @ApiOperation({
    summary: "Create (as DRAFT) or update production page hero + translations",
  })
  async upsertPage(
    @Body() dto: UpsertCmsPageDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.productionAdmin.upsertPage(dto, userId);
  }

  @Post("publish")
  @ApiOperation({ summary: "Publish production page (requires uz, ru, en)" })
  async publish(@CurrentUser("id") userId: string) {
    return this.productionAdmin.setPageStatus(PAGE_STATUS.PUBLISHED, userId);
  }

  @Post("unpublish")
  @ApiOperation({ summary: "Move production page back to DRAFT" })
  async unpublish(@CurrentUser("id") userId: string) {
    return this.productionAdmin.setPageStatus(PAGE_STATUS.DRAFT, userId);
  }

  @Post("steps")
  @ApiOperation({ summary: "Add production step" })
  async createStep(
    @Body() dto: CreateProductionStepDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.productionAdmin.createStep(dto, userId);
  }

  @Patch("steps/:id")
  @ApiOperation({ summary: "Update production step" })
  async updateStep(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductionStepDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.productionAdmin.updateStep(id, dto, userId);
  }

  @Delete("steps/:id")
  @ApiOperation({ summary: "Remove production step (audited)" })
  async deleteStep(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.productionAdmin.deleteStep(id, userId);
  }
}
