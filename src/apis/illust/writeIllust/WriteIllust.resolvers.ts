import Joi from 'joi';
import { getRepository } from 'typeorm';
import { Resolvers, Context } from '../../../typings/resolvers';
import privateResolver from '../../../lib/privateResolver';
import {
  escapeForUrl,
  generateSlugId,
  invalidUrlSlug,
  invalidText,
  filterUnique
} from '../../../lib/utils';
import { getTagIds, iTagslink, iImageLink, checkUser } from '../../../services/repository';
import { WriteIllustMutationArgs, WriteIllustMutationResponse } from './WriteIllust.typing';
import Illust from '../../../entity/Illust';

const resolvers: Resolvers = {
  Mutation: {
    WriteIllust: privateResolver(
      async (
        _,
        args: WriteIllustMutationArgs,
        context: Context
      ): Promise<WriteIllustMutationResponse> => {
        const userId: string = context.req['user_id'];

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
        const illustRepo = getRepository(Illust);

        const uniqueUrlSlug = escapeForUrl(`${title} ${generateSlugId()}`);
        const userUserSlug = url_slug ? escapeForUrl(url_slug) : '';

        let processedSlug = url_slug ? userUserSlug : uniqueUrlSlug;

        if (url_slug) {
          try {
            const [allIllust, exists] = await illustRepo.findAndCount({
              where: {
                url_slug,
                fk_user_id: ''
              }
            });

            if (allIllust && exists > 0) {
              processedSlug = uniqueUrlSlug;
            }
          } catch (e) {
            throw new Error(e);
          }
        }

        if (!invalidText(title, thumbnail)) {
          return {
            ok: false,
            error: '400_INVALID_TEXT'
          };
        }

        if (!invalidUrlSlug(processedSlug)) {
          return {
            ok: false,
            error: '400_INVALID_URL_SLUG'
          };
        }

        const uniqueTags = tags ? filterUnique(tags) : [];
        const uniqueUrls = filterUnique(thumbnail);

        try {
          const tagIds = await Promise.all(uniqueTags.map(tag => getTagIds(tag)));

          const illust = new Illust();
          illust.title = title;
          illust.description = description;
          illust.url_slug = processedSlug;
          illust.is_private = is_private || false;
          illust.fk_user_id = userId;
          await illustRepo.save(illust);

          await iTagslink(illust.id, tagIds);
          await iImageLink(illust.id, uniqueUrls);

          return {
            ok: true,
            error: null
          };
        } catch (e) {
          throw new Error(e);
        }
      }
    )
  }
};

export default resolvers;
