import { render, screen } from "@testing-library/svelte";
import App from '../../../App.svelte';
import { ProviderEnum } from "../../../models/skizzle/ProviderEnum";
import { changeTabAsync } from "../../actions/changeTab";
import { clickButton } from "../../actions/clickButton";
import { connectWith } from "../../actions/connection";
import { AzureDevOpsDescriptorBuilder } from "../../builders/api/DescriptorBuilder";
import { AzureDevOpsProfileBuilder } from "../../builders/api/ProfileBuilder";
import { OAuthConfigBuilder } from "../../builders/providers/OAuthConfigBuilder";
import { RequesterBuilder } from "../../builders/requesters/RequesterBuilder";

test("The application is opened and click on accounts tabs and connect user to azure dev ops", async () => {
  const profile = new AzureDevOpsProfileBuilder()
    .withEmailAddress('john.doe@email.com')
    .withDisplayName('John Doe')
    .build()

  const descriptor = new AzureDevOpsDescriptorBuilder().withDescriptor().build();

  const config = new OAuthConfigBuilder().withToken('Bearer token').build();

  new RequesterBuilder()
    .get('https://app.vssps.visualstudio.com/_apis/profile/profiles/me', profile)
    .get(`https://vssps.dev.azure.com/_apis/graph/descriptors/${profile.id}`, descriptor)

  render(App, {});

  clickButton('Ajouter un compte Azure DevOps');
  connectWith(ProviderEnum.AzureDevOps, config);

  await screen.findByText('Votre compte Azure DevOps');
})