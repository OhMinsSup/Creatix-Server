import Joi from 'joi';
import shortid from 'shortid';
import { Middleware, Context } from 'koa';
import { getCustomRepository } from 'typeorm';
import User from '../../../../database/entity/User';
import Certification from '../../../../database/entity/Certification';
import UserProfile from '../../../../database/entity/UserProfile';
import UserRepository from '../../../../database/repository/UserRepository';
import UserProfileRepository from '../../../../database/repository/UserProfileRepository';
import { setTokenCookie } from '../../../../lib/token';
import { Response } from '../../../../typings/common';
import { sendMail } from '../../../../lib/sendPlatform';
import { emailTemplate } from '../../../../lib/emailTemplate';
import {
  LocalRegisterBodySchema,
  LocalRegisterBodyPayload,
  CheckExistsParamSchema,
  SendEmailBodySchema,
  SendEmailBodyPayload,
  CheckCodeParamSchema,
  CheckCodeBodyPayload,
  CheckExistBodyPayload,
  LocalLoginBodySchema,
  LocalLoginBodyPayload
} from '../../../../typings/auth';

/**
 * Local Register API
 *
 *  POST /api/v1/auth/register/local
 *
 * {
 *    ok: true
 *    error: null
 *    payload: {
 *       user: { ... },
 *       access_token: ...
 *       refresh_token: ...
 *    }
 * }
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const localRegister: Middleware = async (ctx: Context) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .min(1)
      .max(45)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    short_bio: Joi.string()
      .allow('')
      .max(140),
    password: Joi.string()
      .min(6)
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
    } as Response<LocalRegisterBodyPayload>;
    return;
  }

  // Import User & UserProfile entity into custom repository
  const userCustomRespository = await getCustomRepository(UserRepository);
  const userProfileCustomRespository = await getCustomRepository(UserProfileRepository);
  const { username, email, password, short_bio } = ctx.request.body as LocalRegisterBodySchema;

  try {
    // Check if username and email are already existing data
    const exists = await userCustomRespository.findUser(email, username);

    if (exists) {
      ctx.status = 409;
      ctx.body = {
        ok: false,
        error: {
          name: 'ALREADY EXISTS',
          message: email === exists.email ? 'email' : 'username'
        },
        payload: null
      } as Response<LocalRegisterBodyPayload>;
      return;
    }

    // save user
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    await userCustomRespository.save(user);

    // save userProfiles
    const userProfile = new UserProfile();
    userProfile.fk_user_id = user.id;
    userProfile.short_bio = short_bio;
    await userProfileCustomRespository.save(userProfile);

    // token generate
    const tokens = await user.generateUserToken();
    // set Cookie tokens
    setTokenCookie(ctx, tokens);

    ctx.body = {
      ok: true,
      error: null,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          thumbnail: userProfile.thumbnail
        },
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
    } as Response<LocalRegisterBodyPayload>;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * checkExists API
 *
 * GET api/v1/auth/exists/:key(email|username)/:value
 *
 *
 * {
 *    ok: true
 *    error: null
 *    payload: {
 *       exists: ...
 *    }
 * }
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const checkExists: Middleware = async (ctx: Context) => {
  const userCustomRespository = await getCustomRepository(UserRepository);
  const { key, value } = (ctx as any).params as CheckExistsParamSchema;
  try {
    let user: User | undefined;

    // User email or username ex check
    if (key === 'email') {
      user = await userCustomRespository.findOne({
        where: {
          email: value
        }
      });
    } else if (key === 'username') {
      user = await userCustomRespository.findOne({
        where: {
          username: value
        }
      });
    }

    ctx.body = {
      ok: true,
      error: null,
      payload: {
        exists: !!user
      }
    } as Response<CheckExistBodyPayload>;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * sendMail API
 *
 * POST api/v1/auth/sendEmail
 *
 *
 * {
 *    ok: true
 *    error: null
 *    payload: {
 *       code: ...
 *    }
 * }
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const sendEmail: Middleware = async (ctx: Context) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
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
    } as Response<any>;
    return;
  }

  const { email } = ctx.request.body as SendEmailBodySchema;
  try {
    // 이메일로 certification이 존재하는지 체크
    const existingCertification = await Certification.findOne({
      email
    });

    // 만약 이미 존재하면 삭제하고 다시 생성
    if (existingCertification) {
      existingCertification.remove();
    }

    const certification = new Certification();
    certification.code = shortid.generate();
    certification.platform = 'EMAIL';
    certification.email = email;
    certification.save();

    ctx.body = {
      ok: true,
      error: null,
      payload: {
        code: certification.code
      }
    } as Response<SendEmailBodyPayload>;

    // sendMail
    setImmediate(() => {
      sendMail({
        to: certification.email,
        from: 'veloss <mins5190@gmail.com>',
        subject: `이메일 인증`,
        html: emailTemplate(certification.code)
      });
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * checkCode API
 *
 * GET api/v1/auth/sendEmail/check/:code
 *
 *
 * {
 *    ok: true
 *    error: null
 *    payload: {
 *       code: ...
 *    }
 * }
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const checkCode: Middleware = async (ctx: Context) => {
  const { code } = (ctx as any).params as CheckCodeParamSchema;

  try {
    // 코드값으로 certification이 존재하는지 체크
    const existingCertification = await Certification.findOne({
      code
    });

    if (!existingCertification) {
      ctx.status = 409;
      ctx.body = {
        ok: false,
        error: {
          name: 'ERROR CERTIFICATION',
          message: '인증 코드가 발급 되지않은 이메일입니다.'
        },
        payload: {
          exists: false
        }
      } as Response<CheckCodeBodyPayload>;
      return;
    }

    ctx.body = {
      ok: true,
      error: null,
      payload: {
        exists: !!existingCertification
      }
    } as Response<CheckCodeBodyPayload>;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * localLogin API
 *
 * POST api/v1/auth/login/local
 *
 * {
 *    ok: true
 *    error: null
 *    payload: {
 *       user: { ... },
 *       access_token: ...
 *       refresh_token: ...
 *    }
 * }
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const localLogin: Middleware = async (ctx: Context) => {
  const schema = Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
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
    } as Response<LocalLoginBodySchema>;
    return;
  }

  const userCustomRespository = await getCustomRepository(UserRepository);
  const userProfileCustomRespository = await getCustomRepository(UserProfileRepository);
  const { email, password } = ctx.request.body as LocalLoginBodySchema;
  try {
    const user = await userCustomRespository.findOne({
      email
    });

    if (!user || !user.comparePassword(password)) {
      ctx.status = 403;
      ctx.body = {
        ok: false,
        error: {
          name: 'ERROR EXIST',
          message: !user ? '계정을 찾을 수 없습니다.' : '비밀 번호가 일치하지 않습니다.'
        },
        payload: null
      } as Response<LocalLoginBodyPayload>;
      return;
    }

    const profile = await userProfileCustomRespository.findOne({
      fk_user_id: user.id
    });

    if (!profile) {
      ctx.status = 401;
      ctx.body = {
        ok: false,
        error: {
          name: 'ERROR PROFILE',
          message: '유저 프로필이 존재하지 않습니다. 다시 가입해주세요'
        },
        payload: null
      } as Response<LocalLoginBodyPayload>;
      return;
    }

    const tokens = await user.generateUserToken();
    setTokenCookie(ctx, { accessToken: tokens.accessToken, refreshToken: tokens.accessToken });

    ctx.body = {
      ok: true,
      error: null,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          thumbnail: profile.thumbnail
        },
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken
      }
    } as Response<LocalLoginBodyPayload>;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * logout API
 *
 * POST api/v1/auth/logout
 *
 * @param {Context} ctx A Koa Context encapsulates node's request and response objects into a single object which provides many helpful methods for writing web applications and APIs.
 * @returns {compose.Middleware<ParameterizedContext<any, {}>>} Return as Promise type compose.Middleware type
 */
export const logout: Middleware = (ctx: Context) => {
  ctx.cookies.set('access_token', undefined);
  ctx.cookies.set('refresh_token', undefined);

  ctx.status = 200;
};
