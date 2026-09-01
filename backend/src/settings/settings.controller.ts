import { Body, Controller, Delete, Get, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RoleType } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard, Public } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { SettingsService } from "./settings.service";

@ApiTags("Settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get("theme")
  @ApiOperation({
    summary: "Get the site's public theme/color customization settings",
  })
  @ApiResponse({ status: 200, description: "Theme settings returned" })
  async getTheme() {
    return this.settingsService.getTheme();
  }

  @Put("theme")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update the site's theme/color customization settings" })
  @ApiResponse({ status: 200, description: "Theme settings updated" })
  async updateTheme(@Body() dto: UpdateThemeDto) {
    return this.settingsService.updateTheme(dto);
  }

  @Delete("theme")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  @ApiBearerAuth()
  async resetTheme() {
    return this.settingsService.resetTheme();
  }
}
