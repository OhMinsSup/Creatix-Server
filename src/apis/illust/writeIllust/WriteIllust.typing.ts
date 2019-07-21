import Illust from '../../../entity/Illust';

export interface WriteIllustMutationArgs {
  title: string;
  thumbnail: string[];
  is_private: boolean;
  url_slug?: string;
  description?: string;
  tags?: string[];
}

export interface WriteIllustMutationResponse {
  ok: boolean;
  error: any | null;
  illust?: Illust;
}
