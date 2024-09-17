import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'https://dragon-tms.tplinkdns.com:8443/', // URL сервера Keycloak
  realm: 'dragon-tms',               // Ваш Realm
  clientId: 'dragon-tms',        // ID клиента
};

export default keycloakConfig;
