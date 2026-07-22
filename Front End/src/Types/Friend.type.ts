export interface Friend {
  id: string,
  displayName:string,
  username: string,
  avatar?: string,
  isOnline: boolean,
  createdAt?:Date,
}
