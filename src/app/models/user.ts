export interface User {
  id: number;
  role: 'qa' | 'admin' | 'QA' | 'ADMIN' | any;
  name: string;
  rights: 'create' | 'delete' | 'super'
}

export interface UserDTO {
  id: number;
  role: number;
  name: string;
  rights: number;
}
