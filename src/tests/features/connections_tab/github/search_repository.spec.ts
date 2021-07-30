import { connectWith } from "tests/actions/connection";
import { ProviderEnum } from "../../../../models/skizzle";
import { render,screen } from "@testing-library/svelte";
import { GithubProfileBuilder } from "../../../builders/api/ProfileBuilder";
import { OAuthConfigBuilder } from "../../../builders/providers/OAuthConfigBuilder";
import { RequesterBuilder } from "../../../builders/requesters/RequesterBuilder";
import { changeTabAsync } from "../../../actions/changeTab";
import App from 'App.svelte';
import { inputAsync } from "tests/actions/input";
import { formAsync } from "tests/actions/form";
import { GithubRepositoriesBuilder, GithubRepositoryBuilder } from "tests/builders/api/RepositoryBuilder";
import { clickButtonAsync } from "tests/actions/clickButton";
import { config as urls } from 'config';

test("The application is opened and the user search for a repository", async () => {
  const config = new OAuthConfigBuilder()
    .withToken('Bearer token')
    .build();
  const profile = new GithubProfileBuilder()
    .withEmail('john.doe@email.com')
    .withName('John Doe')
    .build();
  const repository = new GithubRepositoryBuilder()
    .withRepositoryCloneUrl("http://repository1.git")
    .withRepositoryFullName("Project1 / Repository1")
    .withRepositoryOwner("John Doe")
    .withRepositoryName('Repository1')
    .build()
  const repository2 = new GithubRepositoryBuilder()
    .withRepositoryCloneUrl("http://repository2.git")
    .withRepositoryFullName("Project1 / Repository2")
    .withRepositoryOwner("Jean ive")
    .withRepositoryName('Repository2')
    .build()
  const repositories = new GithubRepositoriesBuilder()
    .withRepositories(repository)
    .build()
  const searchRepositories = new GithubRepositoriesBuilder()
    .withRepositories(repository2)
    .buildSearch()

  const query = 'Repos';

  new RequesterBuilder()
    .get(urls.Github.get.profile(), profile)
    .get(urls.Github.get.privateRepositories(), repositories)
    .get(urls.Github.get.repositories(query), searchRepositories);
  
  connectWith(ProviderEnum.Github, config);

  render(App, {});

  await changeTabAsync("Comptes");
  await clickButtonAsync('Github');
  await screen.findByText('Votre compte Github');
  await inputAsync("rechercher les repository par valeur", { value: query });
  await formAsync("valider la recherche de repository");
  await screen.findByText('Project1 / Repository1');
  await screen.findByText('Project1 / Repository2');
})