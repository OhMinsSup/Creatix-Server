export interface UpdateIllustMutationArgs {
  illustId: string;
  title: string;
  thumbnail: string[];
  is_private: boolean;
  url_slug?: string;
  description?: string;
  tags?: string[];
}

export interface UpdateIllustMutationResponse {}
