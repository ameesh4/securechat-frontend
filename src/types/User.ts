export type SignupData = {
  email: string;
  password: string;
  public_key: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type SignupResponse = {
  user: User;
};
