export interface IListParams {
  offset: number;
  limit: number;
}

export interface IUser {
  _id: string;
  auth: string;
  type: string;
  username: string;
  name: string;
  email: string;
  contact: string;
  permissions?: string[];
  changedPassword?: boolean;
}

export interface IListResponse<T> {
  total: number;
  items: T[];
}
