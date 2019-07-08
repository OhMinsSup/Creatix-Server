import Joi from 'joi';
import Illust from '../../../entity/Illust';
import { Resolvers, Context } from '../../../typings/resolvers';
import { UpdateIllustMutationArgs, UpdateIllustMutationResponse } from './UpdateIllust.typing';
import { getRepository } from 'typeorm';
import { invalidText, escapeForUrl, generateSlugId, invalidUrlSlug } from '../../../lib/utils';
import { checkIllustExistancy } from '../../../services/illustServices';
import { checkUser } from '../../../services/userServices';
import {
  getTagNames,
  removeTagsFromPost,
  addTagsToPost
} from '../../../services/illustTagServices';
import { updateiImageLink } from '../../../services/illustImageServices';
const diff = require('json-diff');

const resolvers: Resolvers = {
  Mutation: {
    UpdateIllust: async (
      _,
      args: UpdateIllustMutationArgs,
      context: Context
    ): Promise<UpdateIllustMutationResponse> => {
      const userId: string = context.req['user_id'];
      const { illustId } = args;

      let illustData: Illust | null = null;

      try {
        illustData = await checkIllustExistancy(illustId);
        if (!illustData) {
          return {
            ok: false,
            error: '404_ILLUST_NOT_FOUND'
          };
        }
      } catch (e) {
        throw new Error(e);
      }

      try {
        const check = await checkUser(userId);
        if (!check) {
          return {
            ok: false,
            error: '404_USER_NOT_FOUND'
          };
        }
      } catch (e) {
        throw new Error(e);
      }

      const schema = Joi.object().keys({
        title: Joi.string()
          .required()
          .trim()
          .min(1)
          .max(120),
        description: Joi.string(),
        thumbnail: Joi.array()
          .items(Joi.string())
          .required(),
        tags: Joi.array().items(Joi.string()),
        url_slug: Joi.string()
          .trim()
          .min(1)
          .max(130),
        is_private: Joi.boolean().required()
      });

      const result = Joi.validate(args, schema);

      // validate error
      if (result.error) {
        return {
          ok: false,
          error: '404_WRITE_ILLUST_VALIDATION_ERROR'
        };
      }

      const { title, description, tags, url_slug, is_private, thumbnail } = args;

      if (!invalidText(title, thumbnail)) {
        return {
          ok: false,
          error: '400_INVALID_TEXT'
        };
      }

      const generatedUrlSlug = escapeForUrl(`${title} ${generateSlugId()}`);
      const userUrlSlug = escapeForUrl(url_slug || '');

      const urlSlugShouldChange = url_slug !== illustData.url_slug;
      let processedSlug = url_slug ? userUrlSlug : generatedUrlSlug;
      const illustRepo = await getRepository(Illust);

      try {
        if (urlSlugShouldChange) {
          const [allIllust, exists] = await illustRepo.findAndCount({
            where: {
              url_slug: userUrlSlug,
              fk_user_id: userId
            }
          });
          console.log(allIllust);
          if (exists > 0) {
            processedSlug = generatedUrlSlug;
          }
        }
      } catch (e) {
        throw new Error(e);
      }

      if (invalidUrlSlug(processedSlug)) {
        return {
          ok: false,
          error: '400_INVALID_URL_SLUG'
        };
      }

      const query = {
        title,
        description,
        url_slug: urlSlugShouldChange ? processedSlug : undefined,
        is_private: is_private || false
      };

      Object.keys(query).forEach(key => {
        if (query[key] === undefined) {
          delete query[key];
        }
      });

      if (tags) {
        try {
          const currentTags = await getTagNames(illustData.id);
          const tagNames = currentTags.map(tag => tag.tag.name);
          const tagDiff: string[] = diff(tagNames.sort(), tags.sort()) || [];

          const tagsToRemove = tagDiff.filter(info => info[0] === '-').map(info => info[1]);
          const tagsToAdd = tagDiff.filter(info => info[0] === '+').map(info => info[1]);

          await removeTagsFromPost(illustData.id, tagsToRemove);
          await addTagsToPost(illustData.id, tagsToAdd);
        } catch (e) {
          new Error(e);
        }
      }

      if (thumbnail) {
        try {
          await updateiImageLink(illustData.id, thumbnail);
        } catch (e) {
          new Error(e);
        }
      }

      await illustRepo
        .createQueryBuilder()
        .update()
        .set(query)
        .where('id = :id', { id: illustData.id })
        .execute();
      return {
        ok: true,
        error: null
      };
    }
  }
};

export default resolvers;
