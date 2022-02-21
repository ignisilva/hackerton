import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnnouncementService } from './announcement.service';
import {
  CreateAnnouncementInput,
  CreateAnnouncementOutput,
} from './dtos/createAnnouncement.dto';

@ApiTags('공고 API')
@Controller('v1/announcement')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @ApiOperation({
    summary: '공고 생성 API',
    description: '공고를 생성한다 (경우에 따라 job도 생성)',
  })
  @ApiCreatedResponse({
    description: '공고 생성 API 결과값',
    type: CreateAnnouncementOutput,
  })
  @Post()
  createAnnouncement(
    @Body() createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<CreateAnnouncementOutput> {
    return this.announcementService.createAnnouncement(createAnnouncementInput);
  }
}
