import type { MsalAuthProviderProps } from '@rajmohancoder/auth-sdk';
import { appConfig } from '@/config/app.config';

export const msalConfig: Omit<MsalAuthProviderProps, 'children'> = {
  tenantId: appConfig.auth.tenantId,
  clientId: appConfig.auth.clientId,
  redirectUri: appConfig.auth.redirectUri,
  cacheLocation: appConfig.auth.cacheLocation,
  apiScopes: [`api://${appConfig.auth.clientId}/access_as_user`],
};
