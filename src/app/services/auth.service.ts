import { Injectable } from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {
  }

  // Получение access token
  getAccessToken(): string | null | undefined{
    return this.keycloakService.getKeycloakInstance().token;
  }

  // Получение ID token
  getIdToken(): string | null | undefined{
    return this.keycloakService.getKeycloakInstance().idToken;
  }

  // Получение данных из токена
  getTokenParsed(): any {
    return this.keycloakService.getKeycloakInstance().idTokenParsed;
  }

  // Получение, например, email пользователя
  getUserEmail(): string | null {
    const tokenParsed = this.getTokenParsed();
    return tokenParsed ? tokenParsed.email : null;
  }

  // Извлечение realm_access
  getRealmAccessRoles(): string[] {
    const tokenParsed = this.getTokenParsed();
    if (tokenParsed && tokenParsed.realm_access) {
      return tokenParsed.realm_access.roles;
    }
    return [];
  }

}
