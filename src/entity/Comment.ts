import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}

export default Comment;
