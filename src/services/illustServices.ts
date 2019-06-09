import { getRepository, getManager } from 'typeorm';
import Illust from '../entity/Illust';

export const serializeIllust = (data: Illust) => {
  const {
    id,
    title,
    description,
    url_slug,
    is_private,
    views,
    likes,
    user,
    created_at,
    illustsTags,
    illustImages
  } = data;

  const tagDatas = illustsTags.map(tagData => tagData.tag.name);
  const imageDatas = illustImages.map(imageData => imageData.thumbnail);

  return {
    id,
    title,
    description,
    url_slug,
    is_private,
    views,
    likes,
    user: {
      id: user.id,
      username: user.username
    },
    // tslint:disable-next-line: object-shorthand-properties-first
    created_at,
    illustTags: tagDatas,
    illustImages: imageDatas
  };
};

export const checkIllustExistancy = async (illust_id: string): Promise<Illust | null> => {
  try {
    const illustRepo = await getRepository(Illust);
    const illust = await illustRepo.findOne({
      where: {
        id: illust_id
      }
    });
    if (!illust) {
      return null;
    }

    return illust;
  } catch (e) {
    throw new Error(e);
  }
};

export const readIllust = async (username?: string, url_slug?: string, id?: string) => {
  try {
    if ((!username || !url_slug) && id) {
      const data = await getManager()
        .createQueryBuilder(Illust, 'illust')
        .leftJoinAndSelect('illust.user', 'user')
        .leftJoinAndSelect('illust.illustImages', 'illust_image')
        .leftJoinAndSelect('illust.illustsTags', 'illust_tags')
        .leftJoinAndSelect('illust_tags.tag', 'tag')
        .where('illust.id = :id', { id })
        .getOne();

      if (!data) return null;
      return serializeIllust(data);
    }

    const data = await getManager()
      .createQueryBuilder(Illust, 'illust')
      .leftJoinAndSelect('illust.user', 'user')
      .leftJoinAndSelect('illust.illustImages', 'illust_image')
      .leftJoinAndSelect('illust.illustsTags', 'illust_tags')
      .leftJoinAndSelect('illust_tags.tag', 'tag')
      .where('user.username = :username AND illust.url_slug = :url_slug', { username, url_slug })
      .getOne();

    if (!data) return null;
    return serializeIllust(data);
  } catch (e) {
    throw e;
  }
};
