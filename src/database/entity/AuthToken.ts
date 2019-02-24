import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import User from './User';

@Entity()
class AuthToken {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public fk_user_id: string;

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;

  @Column({ default: false })
  public disabled: boolean;

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  public user: User;
}

export default AuthToken;
