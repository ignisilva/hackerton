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
    let isOk = true;
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newAnnouncement = this.announcementRepo.create({
        createdAt,
        companyName,
        dueDate,
        career,
        employType,
        location,
        latitude,
        longitude,
      });
      const announcement = await queryRunner.manager.save(newAnnouncement);

      let newJobs = [];
      for (let i = 0; i < jobs.length; i++) {
        const jobName = jobs[i];
        const foundJob = await queryRunner.manager.findOne(Job, {
          name: jobName,
        });
        if (foundJob) {
          newJobs.push(foundJob);
          continue;
        } else {
          const newJob = this.jobRepo.create({ name: jobName });
          const job = await queryRunner.manager.save(newJob);
          newJobs.push(job);
        }
      }

      for (let i = 0; i < newJobs.length; i++) {
        const job = newJobs[i];
        const newAnnouncementJob = this.announcementJobRepo.create({
          announcement,
          job,
        });
        await queryRunner.manager.save(newAnnouncementJob);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      isOk = false;
    } finally {
      await queryRunner.release();
      if (isOk) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: 'something is wrong',
        };
      }
    }
  }
}
