import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getManager, Repository } from 'typeorm';
import AnnouncementJob from './entities/announcementJob.entity';
import Announcement from './entities/announcement.entity';
import Job from './entities/job.entity';
import {
  CreateAnnouncementInput,
  CreateAnnouncementOutput,
} from './dtos/createAnnouncement.dto';
import {
  GetAnnouncementsOutput,
  GetAnnouncementsQuery,
} from './dtos/getAnnouncements.dto';

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

  async getAnnouncements({
    locationInfo,
    job: jobName,
    career,
  }: GetAnnouncementsQuery): Promise<GetAnnouncementsOutput> {
    try {
      const [ltX, ltY, rtX, rtY, rdX, rdY, ldX, ldY] = locationInfo
        .split(' ')
        .map((v) => Number(v));

      const entityManager = getManager();
      const result = await entityManager.query(
        `
        select * from (select * from announcement where (latitude BETWEEN $1 AND $2) AND (longitude BETWEEN $3 AND $4)) as T2 where career >= $5
      `,
        [ldX, ltX, ltY, rtY, Number(career)],
      );

      let announcements = [];
      for (let i = 0; i < result.length; i++) {
        const announcement = {
          ...result[i],
          job: [jobName],
        };
        announcements.push(announcement);
      }

      return {
        ok: true,
        announcements,
      };
    } catch (error) {
      return;
    }
  }
}
