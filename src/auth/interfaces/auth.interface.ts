export interface IAuthUser {
  token: string;
  refreshToken: string;
  email: string;
  type: number;
  fullName?: string;
  id: string;
}
