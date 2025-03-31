export interface CreateUserDTO {
  badgeId: string;
  email: string; // matches ^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$
  username: string;
  admin: boolean;
}

export interface NewUserInfo {
  username: string;
  password: string;
}
