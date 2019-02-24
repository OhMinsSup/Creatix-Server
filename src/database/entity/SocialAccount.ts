import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity
} from 'typeorm';

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

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;
}

export default SocialAccount;
