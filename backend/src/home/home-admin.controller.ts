import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CMS_EDITOR_ROLES } from "../common/cms/cms.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import {
  CreateHomeHeroDto,
  CreateHomeSectionDto,
  UpdateHomeHeroDto,
  UpdateHomeSectionDto,
} from "./dto/home-admin.dto";
import { HomeAdminService } from "./home-admin.service";

@ApiTags("Admin / Home")
@ApiBearerAuth()
@Controller("admin/home")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...CMS_EDITOR_ROLES)
export class HomeAdminController {
  constructor(private readonly homeAdmin: HomeAdminService) {}

  @Get("heroes")
  @ApiOperation({ summary: "List homepage hero slides incl. inactive" })
  async listHeroes() {
    return this.homeAdmin.listHeroes();
  }

  @Post("heroes")
  @ApiOperation({ summary: "Create homepage hero slide" })
  async createHero(
    @Body() dto: CreateHomeHeroDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.createHero(dto, userId);
  }

  @Patch("heroes/:id")
  @ApiOperation({ summary: "Update homepage hero slide" })
  async updateHero(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateHomeHeroDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.updateHero(id, dto, userId);
  }

  @Post("heroes/:id/activate")
  @ApiOperation({ summary: "Show hero slide" })
  async activateHero(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.setHeroActive(id, true, userId);
  }

  @Post("heroes/:id/deactivate")
  @ApiOperation({ summary: "Hide hero slide (no hard delete)" })
  async deactivateHero(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.setHeroActive(id, false, userId);
  }

  @Get("sections")
  @ApiOperation({ summary: "List homepage sections incl. inactive" })
  async listSections() {
    return this.homeAdmin.listSections();
  }

  @Post("sections")
  @ApiOperation({ summary: "Create homepage section" })
  async createSection(
    @Body() dto: CreateHomeSectionDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.createSection(dto, userId);
  }

  @Patch("sections/:id")
  @ApiOperation({ summary: "Update homepage section" })
  async updateSection(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateHomeSectionDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.updateSection(id, dto, userId);
  }

  @Post("sections/:id/activate")
  @ApiOperation({ summary: "Show homepage section" })
  async activateSection(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.setSectionActive(id, true, userId);
  }

  @Post("sections/:id/deactivate")
  @ApiOperation({ summary: "Hide homepage section (no hard delete)" })
  async deactivateSection(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.homeAdmin.setSectionActive(id, false, userId);
  }
}
