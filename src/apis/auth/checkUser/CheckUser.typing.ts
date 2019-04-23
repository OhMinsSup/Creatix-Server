export interface CheckUserResponse {
  ok: boolean;
  error: any | null;
  user: {
    id: string;
    username: string;
    email: string;
    display_name: string;
    thumbnail: string | null;
  } | null;
}
