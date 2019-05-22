import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import IllustImage from './IllustImage';
import User from './User';
import IllustsTags from './IllustsTags';

@Entity()
class Illust {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  url_slug!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: true })
  is_private!: boolean;

  @Column({ default: 0 })
  likes!: number;

  @Column({ default: 0 })
  views!: number;

  @Column('uuid')
  fk_user_id!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  // 유저
  @ManyToOne(type => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'fk_user_id' })
  user!: User;

  // 일러스트
  @OneToMany(type => IllustImage, illustImage => illustImage.illust)
  illustImages!: IllustImage[];

  // 태그
  @OneToMany(type => IllustsTags, illustsTags => illustsTags.illust)
  illustsTags!: IllustsTags[];
}

export default Illust;
