import { IUser } from "./IUser"

export interface IPost {
  _id: string
  createdAt: string
  imageUrl: string
  tags: string[]
  text: string
  title: string
  updatedAt: string
  viewCount: number
  commentCount: number
  likes: {
    usersLiked: string[],
    likesCount: number
  }
  user: IUser
}