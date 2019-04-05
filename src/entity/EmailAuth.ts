import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
class EmailAuth {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column({ length: 255 })
  public code: string;

  @Column({ length: 255 })
  public email: string;

  @Column({ default: false })
  public logged: boolean;

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;
}

export default EmailAuth;
