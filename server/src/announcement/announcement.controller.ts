import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AnnouncementService } from './announcement.service';
import {
  CreateAnnouncementInput,
  CreateAnnouncementOutput,
} from './dtos/createAnnouncement.dto';
import {
  GetAnnouncementsOutput,
  GetAnnouncementsQuery,
} from './dtos/getAnnouncements.dto';

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

  @ApiOperation({
    summary: '공고 읽기 API',
    description: '공고를 읽는다',
  })
  @ApiCreatedResponse({
    description: '공고 읽기 API 결과값',
    type: GetAnnouncementsOutput,
  })
  @ApiQuery({
    name: 'career',
    description: '경력(연차)',
  })
  @ApiQuery({
    name: 'job',
    description: '직무',
  })
  @ApiQuery({
    name: 'locationInfo',
    description: '"LT, RT, RD, LD"로 이뤄진 단일 string값',
  })
  @Get()
  getAnnouncements(
    @Query() querys: GetAnnouncementsQuery,
  ): Promise<GetAnnouncementsOutput> {
    return this.announcementService.getAnnouncements(querys);
  }
}
