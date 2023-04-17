export const getOnlineUser = (onlineUsers, recipientId) => {
  return onlineUsers.find(user => user?.userId === recipientId)
} 