import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToOne,
  JoinColumn
} from 'typeorm';
import User from './User';

@Entity()
class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar')
  public social_id: string;

  @Column('varchar')
  public access_token: string;

  @Column('varchar')
  public provider: string;

  @Column('uuid')
  public fk_user_id: string;

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

export default SocialAccount;
