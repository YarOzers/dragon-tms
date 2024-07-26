export interface User {
  id: number;
  role: 'qa' | 'admin';
  name: string;
  rights: 'create' | 'delete' | 'super'
}
