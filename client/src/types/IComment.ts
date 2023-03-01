import { IUser } from "./IUser"

export interface IComment {
  _id: string
  createdAt: string
  text: string
  updatedAt: string
  user: IUser
  post: string //postId
}