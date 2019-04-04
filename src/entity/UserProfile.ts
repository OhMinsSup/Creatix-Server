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
  public id: string;

  @Column({ length: 255 })
  public short_bio: string;

  @Column({ type: 'text', nullable: true })
  public thumbnail: string | null;

  @Column('uuid')
  public fk_user_id: string;

  @Column({
    default: {},
    type: 'jsonb'
  })
  public profile_links: any;

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;

  @OneToOne(type => User, { cascade: true })
  @JoinColumn({ name: 'fk_user_id' })
  public user: User;
}

export default UserProfile;
