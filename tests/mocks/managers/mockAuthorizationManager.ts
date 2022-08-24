import { AuthorizationManager } from '../../../src/index';

export class MockAuthorizationManager extends AuthorizationManager {
  getAuthToken = jest.fn<ReturnType<AuthorizationManager['getAuthToken']>, Parameters<AuthorizationManager['getAuthToken']>>(
    (...args: Parameters<AuthorizationManager['getAuthToken']>) => super.getAuthToken(...args)
  );

  authorize = jest.fn<ReturnType<AuthorizationManager['authorize']>, Parameters<AuthorizationManager['authorize']>>(
    (...args: Parameters<AuthorizationManager['authorize']>) => super.authorize(...args)
  );

  unauthorize = jest.fn<ReturnType<AuthorizationManager['unauthorize']>, Parameters<AuthorizationManager['unauthorize']>>(
    (...args: Parameters<AuthorizationManager['unauthorize']>) => super.unauthorize(...args)
  );
}
