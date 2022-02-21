import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Job {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}

export default Job;
