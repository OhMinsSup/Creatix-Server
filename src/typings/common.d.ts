/**
 * Base
 */
export interface Response<R = any> {
  ok: boolean;
  error: object | null;
  payload: R | null;
}

/**
 * Social
 */
export interface Profile {
  id?: number | string;
  thumbnail?: string;
  email?: string;
  name?: string;
}
