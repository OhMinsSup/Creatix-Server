import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class IllustScore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

export default IllustScore;
