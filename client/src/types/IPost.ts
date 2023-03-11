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
  usersCommented: string[]
  usersLiked: string[],
  user: IUser
}