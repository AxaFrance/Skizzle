import { render, screen } from "@testing-library/svelte";
import App from '../../../App.svelte';
import { ProviderEnum } from "../../../models/skizzle/ProviderEnum";
import { clickButton, clickButtonAsync } from "../../actions/clickButton";
import { connectWith } from "../../actions/connection";
import { GithubProfileBuilder } from "../../builders/api/ProfileBuilder";
import { OAuthConfigBuilder } from "../../builders/providers/OAuthConfigBuilder";
import { RequesterBuilder } from "../../builders/requesters/RequesterBuilder";

test("The application is opened and click on accounts tabs and connect user to github", async () => {
  const profile = new GithubProfileBuilder()
    .withEmail('john.doe@email.com')
    .withName('John Doe')
    .build()

  const config = new OAuthConfigBuilder().withToken('Bearer token').build();

  new RequesterBuilder()
    .get('https://api.github.com/user', profile)

  render(App, {});

  await clickButtonAsync('Github');
  clickButton('Ajouter un compte Github');
  connectWith(ProviderEnum.Github, config);

  await screen.findByText('Votre compte Github');
  screen.getByText("John Doe");
  screen.getByText("john.doe@email.com");
});