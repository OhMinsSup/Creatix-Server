import {
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Entity
} from 'typeorm';
import User from './User';

@Entity()
class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  display_name: string;

  @Column({ type: 'text', nullable: true })
  short_bio: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string | null;

  @Column('uuid')
  fk_user_id: string;

  @Column({
    default: {},
    type: 'jsonb'
  })
  profile_links: any;

  @Column('timestampz')
  @CreateDateColumn()
  created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;
}

export default UserProfile;
