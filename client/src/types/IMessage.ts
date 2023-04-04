import { IUser } from "./IUser"

export interface IMessage {
  _id: string
  chat: string
  sender: IUser
  text?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}