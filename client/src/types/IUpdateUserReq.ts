export interface IUpdateUserReq {
  fullName: string,
  email: string,
  password: string,
  avatar: File | string,
}