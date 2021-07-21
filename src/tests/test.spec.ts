import { render } from "@testing-library/svelte";
import App from '../App.svelte';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("test", () => {
  it('Should works', () => {

    render(App, {});


  })
});