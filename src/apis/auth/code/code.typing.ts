import UserProfile from 'src/entity/UserProfile';
import User from 'src/entity/User';

export interface CodeArgs {
  code: string;
}

type CodeRegister = {
  email: string;
  register_token: string;
};

type CodeLogin = {
  user: User;
  profile: UserProfile;
  access_token: string;
  refresh_token: string;
};

export interface CodeResponse {
  ok: boolean;
  error: any | null;
  registerResult?: CodeRegister;
  loginResult?: CodeLogin;
}
