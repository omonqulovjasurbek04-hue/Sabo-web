import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/guards/jwt-auth.guard";
import { AboutService } from "./about.service";

@ApiTags("About")
@Controller("about")
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Get published about company CMS data, timelines, values and team",
  })
  @ApiResponse({ status: 200, description: "About page data returned" })
  async getAbout(@Query("locale") locale = "uz") {
    return this.aboutService.getPublicAboutPage(locale);
  }
}
