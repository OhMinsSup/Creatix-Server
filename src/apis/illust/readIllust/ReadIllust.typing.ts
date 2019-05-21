export interface ReadIllustQueryArgs {
  username: string;
  url_slug: string;
  id?: string;
}

export interface ReadIllustQueryResponse {
  ok: boolean;
  error: any | null;
  illust: any;
}
