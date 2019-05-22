import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import Illust from './Illust';

@Entity()
class IllustImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  thumbnail!: string;

  @Column('uuid')
  fk_illust_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(type => Illust, illust => illust.illustImages)
  @JoinColumn({ name: 'fk_illust_id' })
  illust!: Illust;
}

export default IllustImage;
