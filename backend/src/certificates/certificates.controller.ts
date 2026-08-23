import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "../common/guards/jwt-auth.guard";
import { CertificatesService } from "./certificates.service";

@ApiTags("Certificates")
@Controller("certificates")
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Get all active company quality/safety certificates",
  })
  @ApiResponse({ status: 200, description: "List of certificates returned" })
  async getCertificates() {
    return this.certificatesService.findAllPublic();
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Get certificate details by ID" })
  async getCertificate(@Param("id") id: string) {
    return this.certificatesService.findOne(id);
  }
}
