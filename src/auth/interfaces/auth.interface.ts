import { Types } from 'mongoose';

export interface IAuthUser {
  token?: string;
  refreshToken?: string;
  email: string;
  type: number;
  fullname?:string;
  fullName?: string;
  id: Types.ObjectId;
  isVerified:boolean,
}
