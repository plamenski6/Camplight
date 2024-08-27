export interface Result {
  limit: number;
  skip: number;
  total: number;
  users: User[];
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isDeleted: boolean;
}
