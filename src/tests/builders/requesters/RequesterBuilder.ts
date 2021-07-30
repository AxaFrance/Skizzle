import { when } from "jest-when";
import { electron } from "../../mocks/setup";

export class RequesterBuilder {
  private requester = when(electron.remote.invoke);

  get<T>(key: string, value: T): RequesterBuilder {
    this.requester.calledWith('request', when(args => JSON.parse(args)?.url === key)).mockReturnValue(value)

    return this;
  }
}