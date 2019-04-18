export interface SendAuthEmailArgs {
  email: string;
}

export interface SendAuthEmailResponse {
  ok: boolean;
  error: any | null;
  registered?: boolean;
}
