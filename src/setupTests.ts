import type { OAuthConfigType } from './providers/OAuthConfig.provider';

jest.mock('./shared/token', () => ({
  getToken: jest.fn().mockResolvedValue({
    access_token: 'test'
  } as OAuthConfigType)
}));

jest.mock("./shared/remote", () => ({ 
  remote: { 
    send: jest.fn(),
    receive: jest.fn(),
    once: jest.fn(),
    invoke: jest.fn(),
    openDefaultBrowser: jest.fn(),
    isProduction: jest.fn()
  } 
}));