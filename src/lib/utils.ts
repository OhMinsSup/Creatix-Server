import { getRepository } from 'typeorm';
import User from '../entity/User';

export const isDevClient =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'd2yl9hrj3znjnh.cloudfront.net';

export const isDevServer =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : 'https://creatix-api-server.herokuapp.com/graphql';

export const isPlayground = 'http://localhost:4000/playground';

export const escapeForUrl = (url: string): string => {
  return url
    .replace(
      /[^0-9a-zA-Zㄱ-힣.\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf -]/g,
      ''
    )
    .replace(/ /g, '-')
    .replace(/--+/g, '-');
};

export const generateSlugId = (): string => {
  return `${Math.floor(36 + Math.random() * 1259).toString(36)}${Date.now().toString(36)}`;
};

export function checkEmpty(text: string) {
  if (!text) return true;
  const replaced = text
    .trim()
    .replace(/([\u3164\u115F\u1160\uFFA0\u200B\u0001-\u0008\u000B-\u000C\u000E-\u001F]+)/g, '')
    .replace(/&nbsp;/, '');
  if (replaced === '') return true;
  return false;
}

export const invalidText = (title: string, thumbnail: string[]): boolean => {
  const stringsToCheck = [title, ...thumbnail];
  for (const value in stringsToCheck) {
    if (checkEmpty(value)) {
      return false;
    }
  }
  return true;
};

export const invalidUrlSlug = (urlSlug: string): boolean => {
  if (urlSlug === '' || urlSlug.replace(/\./g, '') === '') {
    return false;
  }
  return true;
};

export const filterUnique = (array: string[]): string[] => {
  return [...new Set(array)];
};

export const checkPostOwnship = (fk_user_id: string, user_id: string): boolean => {
  if (fk_user_id !== user_id) return false;
  return true;
};

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
