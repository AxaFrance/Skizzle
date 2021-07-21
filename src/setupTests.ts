//import './tests/mocks/setup';
import type { OAuthConfigType } from 'providers/OAuthConfig.provider';

jest.mock('./shared/token', () => ({
  getToken: jest.fn().mockResolvedValue({
    access_token: 'test'
  } as OAuthConfigType)
}));