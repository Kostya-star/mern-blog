import { IOnlineUser } from "types/IOnlineUser"

export const getUserOnlineStatus = (onlineUsers: IOnlineUser[], userId?: string) => {
  return onlineUsers.some(user => user.userId === userId)
}