import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Submit a contact message (protected against spam & rate limited)' })
  @ApiResponse({ status: 200, description: 'Message received confirmation' })
  async submitMessage(
    @Body() dto: CreateContactMessageDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.contactService.submitMessage(dto, ip, userAgent);
  }

  @Public()
  @Get('info')
  @ApiOperation({ summary: 'Get official company contact details and working hours' })
  async getContactInfo() {
    return this.contactService.getSiteContact();
  }
}
