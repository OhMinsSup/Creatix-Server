/**
 * LocalRegister
 */
export interface LocalRegisterBodySchema {
  username: string;
  email: string;
  short_bio: string;
  password: string;
}

export interface LocalRegisterBodyPayload {
  user: {
    id: string;
    username: string;
    email: string;
    thumbnail: string | null;
  };
  access_token: string;
  refresh_token: string;
}

/**
 * CheckExists
 */
export interface CheckExistsParamSchema {
  key: string;
  value: string;
}

export interface CheckExistBodyPayload {
  exists: boolean;
}

/**
 * SendEmail
 */
export interface SendEmailBodySchema {
  email: string;
}

export interface SendEmailBodyPayload {
  code: string;
}

/**
 * CheckCode
 */
export interface CheckCodeParamSchema {
  code: string;
}

export interface CheckCodeBodyPayload {
  exists: boolean;
}

/**
 * Local Login
 */
export interface LocalLoginBodySchema {
  email: string;
  password: string;
}

export interface LocalLoginBodyPayload {
  user: {
    id: string;
    username: string;
    email: string;
    thumbnail: string | null;
  };
  access_token: string;
  refresh_token: string;
}
