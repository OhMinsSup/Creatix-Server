export const typeDefs = ["type UserData {\n  id: String\n  username: String\n  email: String\n  display_name: String\n  thumbnail: String\n}\n\ntype CheckUserResponse {\n  ok: Boolean!\n  error: String\n  user: UserData\n}\n\ntype Query {\n  CheckUser: CheckUserResponse\n  Code(code: String!): CodeResponse!\n  Check: CheckResponse!\n  Hello(name: String): HelloResponse!\n}\n\ntype CodeRegister {\n  email: String\n  register_token: String\n}\n\ntype CodeLogin {\n  id: String\n  username: String\n  email: String\n  display_name: String\n  thumbnail: String\n  access_token: String\n  refresh_token: String\n}\n\ntype CodeResponse {\n  ok: Boolean!\n  error: String\n  registerResult: CodeRegister\n  loginResult: CodeLogin\n}\n\ntype Register {\n  id: String\n  username: String\n  email: String\n  display_name: String\n  thumbnail: String\n  access_token: String\n  refresh_token: String\n}\n\ntype LocalRegisterResponse {\n  ok: Boolean!\n  error: String\n  payload: String\n  register: Register\n}\n\ntype Mutation {\n  LocalRegister(register_token: String!, display_name: String!, username: String!, short_bio: String!): LocalRegisterResponse!\n  LogOut: LogOutResponse!\n  SendAuthEmail(email: String!): SendAuthEmailResponse!\n}\n\ntype LogOutResponse {\n  ok: Boolean!\n}\n\ntype SendAuthEmailResponse {\n  ok: Boolean!\n  error: String\n  registered: Boolean\n}\n\ntype AuthToken {\n  id: ID!\n  fk_user_id: String!\n  disabled: Boolean!\n  created_at: String\n  updated_at: String\n}\n\ntype EmailAuth {\n  id: ID!\n  code: String\n  email: String\n  logged: Boolean\n  created_at: String\n  updated_at: String\n}\n\ntype User {\n  id: ID!\n  username: String!\n  email: String!\n  created_at: String\n  updated_at: String\n}\n\nscalar JSON\n\ntype UserProfile {\n  id: ID!\n  display_name: String\n  short_bio: String\n  thumbnail: String\n  fk_user_id: String!\n  profile_links: JSON\n  user: [User]!\n  created_at: String\n  updated_at: String\n}\n\ntype CheckResponse {\n  result: String\n}\n\ntype HelloResponse {\n  result: String\n}\n"];
/* tslint:disable */

export interface Query {
  CheckUser: CheckUserResponse | null;
  Code: CodeResponse;
  Check: CheckResponse;
  Hello: HelloResponse;
}

export interface CodeQueryArgs {
  code: string;
}

export interface HelloQueryArgs {
  name: string | null;
}

export interface CheckUserResponse {
  ok: boolean;
  error: string | null;
  user: UserData | null;
}

export interface UserData {
  id: string | null;
  username: string | null;
  email: string | null;
  display_name: string | null;
  thumbnail: string | null;
}

export interface CodeResponse {
  ok: boolean;
  error: string | null;
  registerResult: CodeRegister | null;
  loginResult: CodeLogin | null;
}

export interface CodeRegister {
  email: string | null;
  register_token: string | null;
}

export interface CodeLogin {
  id: string | null;
  username: string | null;
  email: string | null;
  display_name: string | null;
  thumbnail: string | null;
  access_token: string | null;
  refresh_token: string | null;
}

export interface CheckResponse {
  result: string | null;
}

export interface HelloResponse {
  result: string | null;
}

export interface Mutation {
  LocalRegister: LocalRegisterResponse;
  LogOut: LogOutResponse;
  SendAuthEmail: SendAuthEmailResponse;
}

export interface LocalRegisterMutationArgs {
  register_token: string;
  display_name: string;
  username: string;
  short_bio: string;
}

export interface SendAuthEmailMutationArgs {
  email: string;
}

export interface LocalRegisterResponse {
  ok: boolean;
  error: string | null;
  payload: string | null;
  register: Register | null;
}

export interface Register {
  id: string | null;
  username: string | null;
  email: string | null;
  display_name: string | null;
  thumbnail: string | null;
  access_token: string | null;
  refresh_token: string | null;
}

export interface LogOutResponse {
  ok: boolean;
}

export interface SendAuthEmailResponse {
  ok: boolean;
  error: string | null;
  registered: boolean | null;
}

export interface AuthToken {
  id: string;
  fk_user_id: string;
  disabled: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface EmailAuth {
  id: string;
  code: string | null;
  email: string | null;
  logged: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string | null;
  updated_at: string | null;
}

export type JSON = any;

export interface UserProfile {
  id: string;
  display_name: string | null;
  short_bio: string | null;
  thumbnail: string | null;
  fk_user_id: string;
  profile_links: JSON | null;
  user: Array<User>;
  created_at: string | null;
  updated_at: string | null;
}
