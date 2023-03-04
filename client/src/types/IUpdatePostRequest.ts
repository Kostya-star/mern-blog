import { INewPostRequest } from "./INewPostRequest";

interface IUpdatedPost extends Omit<INewPostRequest, 'imageUrl'> {
  imageUrl: FormData
}

export interface IUpdatePostRequest {
  id: string
  updatedPost: IUpdatedPost
}

