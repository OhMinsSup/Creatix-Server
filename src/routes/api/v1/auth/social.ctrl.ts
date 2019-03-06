import Joi from 'joi';
import { Middleware, Context } from 'koa';
import { getCustomRepository, getRepository } from 'typeorm';
import getSocialProfile from '../../../../lib/getSocialProfile';
import { Profile } from '../../../../typings/common';
import { SocialRegisterBodySchema, SocialRegisterParamsSchema } from '../../../../typings/auth';
import UserRepository from '../../../../database/repository/UserRepository';
import SocialAccount from '../../../../database/entity/SocialAccount';
import User from '../../../../database/entity/User';

export const socialRegister: Middleware = async (ctx: Context) => {
  const schema = Joi.object().keys({
    accessToken: Joi.string().required(),
    form: Joi.object()
      .keys({
        fallbackEmail: Joi.string(),
        username: Joi.string()
          .regex(/^[a-z0-9-_]+$/)
          .min(3)
          .max(16)
          .required(),
        shortBio: Joi.string()
          .allow('')
          .max(140)
          .optional()
      })
      .required()
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = {
      ok: false,
      error: {
        name: result.error.name,
        message: result.error.details
      },
      payload: null
    };
    return;
  }

  const socialAccountRespository = await getRepository(SocialAccount);
  const userCustomRespository = await getCustomRepository(UserRepository);
  const { provider } = ctx.params as SocialRegisterParamsSchema;
  const { accessToken, form } = ctx.request.body as SocialRegisterBodySchema;

  let profile: Profile | null = null;

  try {
    profile = await getSocialProfile(provider, accessToken);
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      name: 'WRONG_CREDENTIALS'
    };
    return;
  }

  if (!profile) return;

  const { id, thumbnail, email, name } = profile;
  const { username, shortBio, fallbackEmail } = form;

  const socialId = id && id.toString();
  const fallbackedEmail = (email && email) || fallbackEmail;
  const fallbackedName = (name && name) || username;

  try {
    const exists = await userCustomRespository.findUser(
      fallbackedEmail ? fallbackedEmail : null,
      fallbackedName
    );

    if (exists) {
      ctx.status = 409;
      ctx.body = {
        ok: false,
        error: {
          name: 'ALREADY EXISTS',
          message: email === exists.email ? 'email' : 'username'
        },
        payload: null
      };
      return;
    }

    const socialExists = await socialAccountRespository
      .createQueryBuilder()
      .where('social_id=:id', { id: socialId })
      .getOne();

    if (socialExists) {
      ctx.status = 409;
      ctx.body = {
        name: 'SOCIAL_ACCOUNT_EXISTS'
      };
      return;
    }

    const user = new User();
    user.username = fallbackedName;
    user.email = fallbackedEmail;
    await userCustomRespository.save(user);

    if (!email) {
      // 메일 보내기
    }

    console.log(thumbnail, shortBio);
  } catch (e) {
    ctx.throw(500, e);
  }
};
