import { INewPostRequest } from "./INewPostRequest";

interface IUpdatedPost extends INewPostRequest {}

export interface IUpdatePostRequest {
  id: string
  updatedPost: IUpdatedPost
}

