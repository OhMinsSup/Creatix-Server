export type Token<P = any> = P | string | object | Buffer;
export type GenerateToken<G = any> = Token<G>;
export type DecodedToken<D = any> = any | Token<D>;

export interface BasicToken {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
}

export interface AccessTokenData extends BasicToken {
  user_id: string;
}

export interface RefreshTokenData extends BasicToken {
  user_id: string;
  token_id: string;
}
