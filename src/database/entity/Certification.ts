import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm';

@Entity()
class Certification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  public email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  public code: string;

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;
}

export default Certification;
