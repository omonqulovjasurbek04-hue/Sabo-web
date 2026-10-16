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
import { AboutAdminService } from "./about-admin.service";
import {
  CreateAboutTimelineDto,
  CreateAboutValueDto,
  CreateTeamMemberDto,
  UpdateAboutTimelineDto,
  UpdateAboutValueDto,
  UpdateTeamMemberDto,
} from "./dto/about-admin.dto";

@ApiTags("Admin / About")
@ApiBearerAuth()
@Controller("admin/about")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...CMS_EDITOR_ROLES)
export class AboutAdminController {
  constructor(private readonly aboutAdmin: AboutAdminService) {}

  @Get()
  @ApiOperation({
    summary: "Get about page (any status) with timeline, values and team",
  })
  async getOverview() {
    return this.aboutAdmin.getOverview();
  }

  @Put()
  @ApiOperation({
    summary: "Create (as DRAFT) or update the about page hero + translations",
  })
  async upsertPage(
    @Body() dto: UpsertCmsPageDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.upsertPage(dto, userId);
  }

  @Post("publish")
  @ApiOperation({ summary: "Publish about page (requires uz, ru, en)" })
  async publish(@CurrentUser("id") userId: string) {
    return this.aboutAdmin.setPageStatus(PAGE_STATUS.PUBLISHED, userId);
  }

  @Post("unpublish")
  @ApiOperation({ summary: "Move about page back to DRAFT" })
  async unpublish(@CurrentUser("id") userId: string) {
    return this.aboutAdmin.setPageStatus(PAGE_STATUS.DRAFT, userId);
  }

  @Post("timelines")
  @ApiOperation({ summary: "Add timeline item" })
  async createTimeline(
    @Body() dto: CreateAboutTimelineDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.createTimeline(dto, userId);
  }

  @Patch("timelines/:id")
  @ApiOperation({ summary: "Update timeline item" })
  async updateTimeline(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateAboutTimelineDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.updateTimeline(id, dto, userId);
  }

  @Delete("timelines/:id")
  @ApiOperation({ summary: "Remove timeline item (audited)" })
  async deleteTimeline(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.deleteTimeline(id, userId);
  }

  @Post("values")
  @ApiOperation({ summary: "Add company value" })
  async createValue(
    @Body() dto: CreateAboutValueDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.createValue(dto, userId);
  }

  @Patch("values/:id")
  @ApiOperation({ summary: "Update company value" })
  async updateValue(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateAboutValueDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.updateValue(id, dto, userId);
  }

  @Delete("values/:id")
  @ApiOperation({ summary: "Remove company value (audited)" })
  async deleteValue(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.deleteValue(id, userId);
  }

  @Get("team")
  @ApiOperation({ summary: "List team members incl. inactive" })
  async listTeam() {
    return this.aboutAdmin.listTeam();
  }

  @Post("team")
  @ApiOperation({ summary: "Add team member" })
  async createTeamMember(
    @Body() dto: CreateTeamMemberDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.createTeamMember(dto, userId);
  }

  @Patch("team/:id")
  @ApiOperation({ summary: "Update team member" })
  async updateTeamMember(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateTeamMemberDto,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.updateTeamMember(id, dto, userId);
  }

  @Post("team/:id/activate")
  @ApiOperation({ summary: "Show team member publicly" })
  async activateTeamMember(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.setTeamMemberActive(id, true, userId);
  }

  @Post("team/:id/deactivate")
  @ApiOperation({ summary: "Hide team member (no hard delete)" })
  async deactivateTeamMember(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser("id") userId: string,
  ) {
    return this.aboutAdmin.setTeamMemberActive(id, false, userId);
  }
}
