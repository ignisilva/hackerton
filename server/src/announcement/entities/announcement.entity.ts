import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Job {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'datetime' })
  public createAt: string;

  @Column()
  public companyName: string;

  @Column({ type: 'datetime' })
  public dueDate: string;

  @Column({ default: null, nullable: true })
  public career?: number;

  @Column()
  public employType: string;

  @Column()
  public location: string;

  latitude: number;
}

export default Job;
