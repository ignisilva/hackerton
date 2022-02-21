import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import AnnouncementJob from './announcement-job.entity';

export enum EmployType {
  NON_REGULAR = 'NON_REGULAR',
  REGULAR = 'REGULAR',
}

@Entity()
class Announcement {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'timestamp' })
  public createAt: string;

  @Column()
  public companyName: string;

  @Column({ type: 'timestamp' })
  public dueDate: string;

  @Column({ default: null, nullable: true })
  public career?: number;

  @Column({ type: 'enum', enum: EmployType })
  public employType: EmployType;

  @Column()
  public location: string;

  @Column({ type: 'numeric' })
  public latitude: number;

  @Column({ type: 'numeric' })
  public longitude: number;

  @OneToMany(
    (type) => AnnouncementJob,
    (announcementJob) => announcementJob.announcement,
  )
  jobs: AnnouncementJob[];
}

export default Announcement;
