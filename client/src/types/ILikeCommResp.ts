import { ILikePostResp } from './ILikePostResp';

export interface ILikeCommResp extends Omit<ILikePostResp, 'postId'> {
  commId: string;
}
