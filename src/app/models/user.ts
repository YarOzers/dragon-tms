export interface User {
  id: number;
  role: 'QA' | 'ADMIN' ;
  name: string;
  rights:  'CREATE' | 'DELETE' | 'SUPER' ;
}

export interface UserDTO {
  id: number;
  role: number;
  name: string;
  rights: number;
}
