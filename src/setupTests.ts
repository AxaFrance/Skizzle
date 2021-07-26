import type { OAuthConfigType } from './providers/OAuthConfig.provider';
import { electron } from './tests/mocks/setup';

jest.mock('./shared/token', () => ({
  getToken: jest.fn().mockResolvedValue({
    access_token: 'test'
  } as OAuthConfigType)
}));

jest.mock("./shared/remote", () => electron);