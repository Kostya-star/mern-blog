import { IChat } from "./IChat"
import { IUser } from "./IUser"

export interface IMessage {
  _id: string
  chat: IChat
  sender: IUser
  isRead: boolean
  text?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  isLiked: boolean
}