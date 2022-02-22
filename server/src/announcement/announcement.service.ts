import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import AnnouncementJob from './entities/announcementJob.entity';
import Announcement from './entities/announcement.entity';
import Job from './entities/job.entity';
import {
  CreateAnnouncementInput,
  CreateAnnouncementOutput,
} from './dtos/createAnnouncement.dto';
import { first } from 'rxjs';

@Injectable()
export class AnnouncementService {
  constructor(
    private connection: Connection,

    @InjectRepository(Announcement)
    private readonly announcementRepo: Repository<Announcement>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,

    @InjectRepository(AnnouncementJob)
    private readonly announcementJobRepo: Repository<AnnouncementJob>,
  ) {}

  // 'createAt',
  // 'companyName',
  // 'dueDate',
  // 'career',
  // 'employType',
  // 'location',
  // 'latitude',
  // 'longitude',
  // 'jobs'
  async createAnnouncement({
    createdAt,
    companyName,
    dueDate,
    career,
    employType,
    location,
    latitude,
    longitude,
    jobs,
  }: CreateAnnouncementInput): Promise<CreateAnnouncementOutput> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const announcement = await this.announcementRepo.save(
        this.announcementRepo.create({
          createdAt,
          companyName,
          dueDate,
          career,
          employType,
          location,
          latitude,
          longitude,
        }),
      );

      let newJobs = [];
      for (let i = 0; i < jobs.length; i++) {
        const jobName = jobs[i];
        const foundJob = await this.jobRepo.findOne({ name: jobName });
        if (foundJob) {
          newJobs.push(foundJob);
          continue;
        }
        const newJob = await this.jobRepo.save(
          this.jobRepo.create({ name: jobName }),
        );
        newJobs.push(newJob);
      }

      for (let i = 0; i < newJobs.length; i++) {
        const job = newJobs[i];
        await this.announcementJobRepo.save(
          this.announcementJobRepo.create({ announcement, job }),
        );
      }

      return {
        ok: true,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        ok: false,
        error,
      };
    } finally {
      queryRunner.release();
    }
  }
}
