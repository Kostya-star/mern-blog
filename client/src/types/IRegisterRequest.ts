import { ILoginRequest } from 'types/ILoginRequest';

export interface IRegisterRequest extends ILoginRequest {
  fullName: string;
  avatar?: null | File
}
