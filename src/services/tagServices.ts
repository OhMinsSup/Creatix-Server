import { getRepository } from 'typeorm';
import Tag from '../entity/Tag';

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

export const getbulkGetIds = async (datas: string[]) => {
  try {
    const tags = await Promise.all(datas.map(data => getTagIds(data)));
    return tags;
  } catch (e) {
    throw e;
  }
};
