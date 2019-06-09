import { getRepository } from 'typeorm';
import User from '../entity/User';

export const checkUser = async (user_id: string): Promise<boolean> => {
  try {
    const userRepo = await getRepository(User);
    const user = await userRepo.findOne({
      where: {
        id: user_id
      }
    });
    if (!user) return false;
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
