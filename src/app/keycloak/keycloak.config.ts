import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'http://188.235.130.37:8090/', // URL сервера Keycloak
  realm: 'dragon-tms',               // Ваш Realm
  clientId: 'dragon-tms',        // ID клиента
};

export default keycloakConfig;
