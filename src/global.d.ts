import { KeycloakInstance } from "keycloak-js";

declare global {
  interface Window {
    keycloak: KeycloakInstance;
  }
}

export {};
