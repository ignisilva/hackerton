import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';
import AnnouncementJob from './entities/announcementJob.entity';
import Announcement from './entities/announcement.entity';
import Job from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, Job, AnnouncementJob])],
  controllers: [AnnouncementController],
  providers: [AnnouncementService],
})
export class AnnouncementModule {}
