import { IUser } from "./IUser";

export interface IFollower extends IUser {
  isFollowLoading?: boolean
}