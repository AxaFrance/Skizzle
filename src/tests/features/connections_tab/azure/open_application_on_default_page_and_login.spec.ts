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
import { AzureDevOpsOrganizationBuilder, AzureDevOpsOrganizationsBuilder } from "tests/builders/api/OrganizationBuilder";

test("The application is opened and click on accounts tabs and connect user to azure dev ops", async () => {
  const profile = new AzureDevOpsProfileBuilder()
    .withEmailAddress('john.doe@email.com')
    .withDisplayName('John Doe')
    .build()
    
  const organization = new AzureDevOpsOrganizationBuilder()
  .withOrganizationName('AzureOrg1')
  .build();

  const organizations = new AzureDevOpsOrganizationsBuilder()
    .withOrganizations(organization)
    .build();

  const descriptor = new AzureDevOpsDescriptorBuilder().withDescriptor().build();

  const config = new OAuthConfigBuilder().withToken('Bearer token').build();

  new RequesterBuilder()
    .get(urls.AzureDevOps.get.profile('me'), profile)
    .get(urls.AzureDevOps.get.descriptor(String(profile.id)), descriptor)
    .get(urls.AzureDevOps.get.organizations(String(profile.id)), organizations)
    .build();

  render(App, {});

  clickButton('Ajouter un compte AzureDevOps');
  connectWith(ProviderEnum.AzureDevOps, config);

  await screen.findByText('Votre compte AzureDevOps');
})