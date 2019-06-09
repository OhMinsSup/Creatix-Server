import { getRepository } from 'typeorm';
import { getbulkGetIds } from './tagServices';
import IllustsTags from '../entity/IllustsTags';

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

export const getTagNames = async (illust_id: string) => {
  try {
    const illustsTagsRepo = await getRepository(IllustsTags);

    const data = await illustsTagsRepo
      .createQueryBuilder('illusts_tags')
      .leftJoinAndSelect('illusts_tags.tag', 'tag')
      .select('illust_tags.name')
      .where('fk_illust_id = :id', { id: illust_id })
      .getMany();

    if (data.length === 0 || !data) {
      return null;
    }

    return data;
  } catch (e) {
    throw e;
  }
};

export const addTagsToPost = async (illust_id: string, tags: string[]) => {
  try {
    const illustsTagsRepo = await getRepository(IllustsTags);
    const tagIds = await getbulkGetIds(tags);
    const promises = tagIds.map(tagId => {
      const iTags = new IllustsTags();
      iTags.fk_illust_id = illust_id;
      iTags.fk_tag_id = tagId;
      return illustsTagsRepo.save(iTags);
    });

    return await Promise.all(promises);
  } catch (e) {
    throw e;
  }
};

export const removeTagsFromPost = async (illustId: string, tags: string[]) => {
  if (tags.length === 0) return;
  try {
    const illustsTagsRepo = await getRepository(IllustsTags);
    const tagIds = await getbulkGetIds(tags);
    const promises = tagIds.map(tagId =>
      illustsTagsRepo
        .createQueryBuilder()
        .delete()
        .where('fk_illust_id = :illustId AND fk_tagId = :tag_id', { illustId, tagId })
        .execute()
    );

    return await Promise.all(promises);
  } catch (e) {
    throw e;
  }
};
