export interface User {
  id: number
  roles: string[]
  name: string
  email: string
}

export interface UserDTO {
  roles: string[]
  name: string
  email: string
}
