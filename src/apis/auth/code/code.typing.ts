export interface CodeArgs {
  code: string;
}

type CodeRegister = {
  email: string;
  register_token: string;
};

type CodeLogin = {
  id: string;
  username: string;
  email: string;
  display_name: string;
  thumbnail: string | null;
  access_token: string;
  refresh_token: string;
};

export interface CodeResponse {
  ok: boolean;
  error: any | null;
  registerResult?: CodeRegister;
  loginResult?: CodeLogin;
}
