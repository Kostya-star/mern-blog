import { IComment } from './IComment';
import { IPost } from './IPost';

export interface ICreateCommentResponse {
  comment: IComment;
  updatedPost: IPost;
}
