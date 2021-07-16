//@ts-ignore
import App from './App.svelte';
import { worker } from "./mocks/browser";

if (!window.remote.isProduction) {
  worker.start();
}

const app = new App({
	target: document.body,
});

export default app;
