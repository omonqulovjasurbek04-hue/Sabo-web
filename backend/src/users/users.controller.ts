import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { ChangePasswordDto, UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current logged-in user profile" })
  @ApiResponse({ status: HttpStatus.OK, description: "User profile returned" })
  async getProfile(@CurrentUser("id") userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch("me")
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({ status: HttpStatus.OK, description: "Profile updated" })
  async updateProfile(
    @CurrentUser("id") userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch("me/password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change user password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Password changed successfully",
  })
  async changePassword(
    @CurrentUser("id") userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, dto);
  }

  @Get("me/sessions")
  @ApiOperation({ summary: "List active user sessions" })
  async getSessions(@CurrentUser("id") userId: string) {
    return this.usersService.getSessions(userId);
  }

  @Delete("me/sessions/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revoke a specific session" })
  async revokeSession(
    @CurrentUser("id") userId: string,
    @Param("id") sessionId: string,
  ) {
    return this.usersService.revokeSession(userId, sessionId);
  }
}
