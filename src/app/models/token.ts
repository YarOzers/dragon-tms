export interface RealmAccess {
  roles: string[];
}

export interface DecodedToken {
  realm_access: RealmAccess;
  name: string;
  email: string;
  // добавьте другие поля токена, если они нужны
}
