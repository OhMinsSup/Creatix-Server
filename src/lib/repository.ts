import { getRepository, getManager } from 'typeorm';
import Tag from '../entity/Tag';
import IllustsTags from '../entity/IllustsTags';
import IllustImage from '../entity/IllustImage';
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
    created_at,
    illustTags: tagDatas,
    illustImages: imageDatas
  };
};

export const getTagIds = async (tag: string) => {
  const name = tag.trim();

  try {
    const tagRepo = await getRepository(Tag);

    let tag = await tagRepo.findOne({
      where: { name: name.replace(/\-/g, ' ').toLowerCase() }
    });

    if (!tag) {
      tag = new Tag();
      tag.name = name.replace(/\-/g, ' ').toLowerCase();
      await tagRepo.save(tag);
    }

    return tag.id;
  } catch (e) {
    throw new Error(e);
  }
};

export const iTagslink = async (illustId: string, tagIds: string[]) => {
  if (!illustId && !tagIds) return null;
  try {
    const iTagsRepo = getRepository(IllustsTags);
    const promises = tagIds.map(tagId => {
      const iTags = new IllustsTags();
      iTags.fk_illust_id = illustId;
      iTags.fk_tag_id = tagId;
      return iTagsRepo.save(iTags);
    });

    return await Promise.all(promises);
  } catch (e) {
    throw new Error(e);
  }
};

export const iImageLink = async (illustId: string, thumbnails: string[]) => {
  if (!illustId && !thumbnails) return null;

  try {
    const iImageRepo = await getRepository(IllustImage);
    const promises = thumbnails.map(thumbnail => {
      const iImage = new IllustImage();
      iImage.fk_illust_id = illustId;
      iImage.thumbnail = thumbnail;
      return iImageRepo.save(iImage);
    });

    return await Promise.all(promises);
  } catch (e) {
    throw new Error(e);
  }
};

export const readIllust = async (username: string, url_slug: string, id?: string) => {
  try {
    if (id) {
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
