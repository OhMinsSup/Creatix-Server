import { EntityRepository, Repository } from 'typeorm';
import User from '../entity/User';

@EntityRepository(User)
class UserRepository extends Repository<User> {
  public findUser(email: string | null, username: string | null) {
    return this.createQueryBuilder()
      .where('email=:email OR username=:username', { email, username })
      .getOne();
  }
}

export default UserRepository;
