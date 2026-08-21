import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/guards/jwt-auth.guard';
import { ProductionService } from './production.service';

@ApiTags('Production')
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get published production process CMS data' })
  @ApiResponse({ status: 200, description: 'Production steps and process data' })
  async getProduction(@Query('locale') locale = 'uz') {
    return this.productionService.getPublicProductionPage(locale);
  }
}
