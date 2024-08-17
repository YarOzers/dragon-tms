export interface User {
  id: number;
  role: 'qa' | 'admin';
  name: string;
  rights: 'create' | 'delete' | 'super'
}

export interface UserDTO {
  id: number;
  role: number;
  name: string;
  rights: number;
}
