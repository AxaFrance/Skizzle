import { when } from 'jest-when'
import type { Dictionary } from '../../shared/utils';

export const electron = ({
    remote: { 
        send: jest.fn(),
        receive: jest.fn(),
        once: jest.fn(),
        invoke: jest.fn(),
        openDefaultBrowser: jest.fn(),
        isProduction: jest.fn()
      } 
})

export const mockFetchingRequest = <T>(values: Dictionary<T>) => {    
    const whenFn = when(electron.remote.invoke)

    for (const [key, value] of Object.entries(values)) {
        whenFn.calledWith('request', when(args => JSON.parse(args)?.url.startsWith(key))).mockReturnValue(value);
    }  
}