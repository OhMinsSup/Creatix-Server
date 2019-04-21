export interface LocalRegisterArgs {
  register_token: string;
  display_name: string;
  username: string;
  short_bio: string;
}

export interface LocalRegisterResponse {
  ok: boolean;
  error: any | null;
  payload?: string;
  register?: {
    id: string;
    username: string;
    email: string;
    display_name: string;
    thumbnail: string | null;
    access_token: string;
    refresh_token: string;
  };
}
