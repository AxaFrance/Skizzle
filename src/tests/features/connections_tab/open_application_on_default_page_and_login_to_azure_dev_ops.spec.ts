import { render, screen } from "@testing-library/svelte";
import { rest } from "msw";
import App from '../../../App.svelte';
import { ProviderEnum } from "../../../models/skizzle/ProviderEnum";
import actions from "../../actions";
import { AzureDevOpsDescriptorBuilder } from "../../builders/api/DescriptorBuilder";
import { AzureDevOpsProfileBuilder } from "../../builders/api/ProfileBuilder";
import { OAuthConfigBuilder } from "../../builders/providers/OAuthConfigBuilder";
import { server } from "../../mocks/server";

test("The application is opened and click on accounts tabs and connect user to azure dev ops", async () => {
  const profile = new AzureDevOpsProfileBuilder()
    .withId('1')
    .withEmailAddress('john.doe@email.com')
    .withDisplayName('John Doe')
    .withAvatar()
    .build()

  const descriptor = new AzureDevOpsDescriptorBuilder().withDescriptor().build();

  server.use(
    rest.get(`https://app.vssps.visualstudio.com/_apis/profile/profiles/me`, (req, res, ctx) =>
      res(ctx.json(profile)),
    ),
    rest.get(`https://vssps.dev.azure.com/_apis/graph/descriptors/${profile.id}`, (req, res, ctx) =>
      res(ctx.json(descriptor)),
    ),
  );

  render(App, {});

  await actions.changeTabAsync('Comptes');
  await actions.clickButtonAsync('Ajouter un compte Azure DevOps');
  const config = new OAuthConfigBuilder().withToken().build(ProviderEnum.AzureDevOps);

  const azureDevOpsConnectedMessage = await screen.findByText('Votre compte Azure DevOps');

  expect(azureDevOpsConnectedMessage).toBeInTheDocument();
  expect(config.access_token).not.toBeNull();
})