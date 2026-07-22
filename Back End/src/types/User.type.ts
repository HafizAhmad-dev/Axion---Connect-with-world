import { BaseEntity } from "./Base.type";

export interface User extends BaseEntity {
  username: string;
  displayName: string;
  email: string;
  avatar?: string;
  lastSeen?: string;
  isOnline?:boolean;
  password:string;
  lastLoginAt:string | null;
}
