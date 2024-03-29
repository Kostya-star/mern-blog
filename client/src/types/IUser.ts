export interface IUser {
  createdAt: string;
  email: string;
  fullName: string;
  updatedAt: string;
  _id: string;
  avatarUrl?: string;
  token?: string;
  postsCreated: number
  usersFollowing: string[]
  usersFollowed: string[]
}
