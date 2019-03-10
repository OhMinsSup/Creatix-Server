declare module 'CommonTyping' {
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

  /**
   * Mail
   */
  interface Mail {
    to: string;
    from: string;
    subject: string;
    html: string;
  }
}
