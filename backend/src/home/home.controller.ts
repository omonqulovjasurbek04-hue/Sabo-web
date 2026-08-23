import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/guards/jwt-auth.guard";
import { HomeService } from "./home.service";

@ApiTags("Home")
@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary:
      "Get cached homepage aggregated data (Hero, Featured, CMS previews, Blog)",
  })
  @ApiResponse({ status: 200, description: "Homepage data returned" })
  async getHome(@Query("locale") locale = "uz") {
    return this.homeService.getHomeData(locale);
  }
}
