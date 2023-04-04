import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChat {
  _id: string
  participants: IUser[]
  createdAt: string
  updatedAt: string
  latestMessage?: IMessage
}