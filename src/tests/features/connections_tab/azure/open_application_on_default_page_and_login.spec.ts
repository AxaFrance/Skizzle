import { render, screen } from "@testing-library/svelte";
import App from 'App.svelte';
import { ProviderEnum } from "models/skizzle/ProviderEnum";
import { clickButton } from "tests/actions/clickButton";
import { connectWith } from "tests/actions/connection";
import { AzureDevOpsDescriptorBuilder } from "tests/builders/api/DescriptorBuilder";
import { AzureDevOpsProfileBuilder } from "tests/builders/api/ProfileBuilder";
import { OAuthConfigBuilder } from "tests/builders/providers/OAuthConfigBuilder";
import { RequesterBuilder } from "tests/builders/requesters/RequesterBuilder";
import { config as urls } from 'config';

test("The application is opened and click on accounts tabs and connect user to azure dev ops", async () => {
  const profile = new AzureDevOpsProfileBuilder()
    .withEmailAddress('john.doe@email.com')
    .withDisplayName('John Doe')
    .build()

  const descriptor = new AzureDevOpsDescriptorBuilder().withDescriptor().build();

  const config = new OAuthConfigBuilder().withToken('Bearer token').build();

  new RequesterBuilder()
    .get(urls.AzureDevOps.get.profile('me'), profile)
    .get(urls.AzureDevOps.get.descriptor(String(profile.id)), descriptor)

  render(App, {});

  clickButton('Ajouter un compte AzureDevOps');
  connectWith(ProviderEnum.AzureDevOps, config);

  await screen.findByText('Votre compte AzureDevOps');
})