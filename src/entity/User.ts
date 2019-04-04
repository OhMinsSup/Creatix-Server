import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column({ unique: true, type: 'varchar' })
  public username: string;

  @Index()
  @Column({ unique: true, type: 'varchar' })
  public email: string;

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;
}

export default User;
