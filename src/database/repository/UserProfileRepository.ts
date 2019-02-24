import { EntityRepository, Repository } from 'typeorm';
import UserProfile from '../entity/UserProfile';

@EntityRepository(UserProfile)
class UserProfileRepository extends Repository<UserProfile> {}

export default UserProfileRepository;
