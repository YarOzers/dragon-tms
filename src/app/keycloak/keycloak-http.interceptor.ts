import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const keycloakHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService); // Получаем экземпляр KeycloakService
  const token = keycloak.getKeycloakInstance().token; // Извлекаем токен

  if (token) {
    // Клонируем запрос и добавляем токен в заголовок Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq);
  }

  // Если токена нет, передаем исходный запрос
  return next(req);
};
