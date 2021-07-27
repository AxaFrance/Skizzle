import { when } from "jest-when";
import type { Dictionary } from "../../../shared/utils";
import { electron } from "../../mocks/setup";

export class RequesterBuilder {
  private requester = when(electron.remote.invoke);
  private values: Dictionary<any> = {};

  withMockedData<T>(url: string, value: T): RequesterBuilder {
    this.values[url] = value

    return this;
  }

  build(): void {
    for (const [key, value] of Object.entries(this.values)) {
      this.requester.calledWith('request', when(args => JSON.parse(args)?.url.startsWith(key))).mockReturnValue(value);
   }  
  } 
}