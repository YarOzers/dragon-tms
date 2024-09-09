import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {KeycloakService} from 'keycloak-angular';
import keycloakConfig from './keycloak/keycloak.config';
import {routes} from "./app.routes";
import {keycloakHttpInterceptor} from "./keycloak/keycloak-http.interceptor";

// Функция для инициализации Keycloak
function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'login-required', // или 'check-sso'
      },
      enableBearerInterceptor: true, // для автоматического добавления токена в запросы
      bearerExcludedUrls: ['/assets'], // исключить запросы, куда токен не нужен
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([keycloakHttpInterceptor])),

    // Добавляем KeycloakService как провайдер
    {
      provide: KeycloakService,
      useClass: KeycloakService,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
  ]
};
