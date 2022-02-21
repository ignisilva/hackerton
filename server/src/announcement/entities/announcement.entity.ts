import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  public employType: string;

  @Column()
  public location: string;

  latitude: number;
}

export default Announcement;
