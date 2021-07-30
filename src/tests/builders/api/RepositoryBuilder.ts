import { v4 } from 'uuid';
import type { AzureDevOpsRepositoriesApiType, AzureDevOpsRepositoryApiType, GithubRepositoriesApiType, GithubRepositoryApiType, GithubSeachRepositoriesApiType } from 'models/api/RepositoriesApiType';

class AzureDevOpsRepositoryBuilder {
  private repository = {} as AzureDevOpsRepositoryApiType;

  constructor() {    
    this.repository.id = v4();
  }

  withRepositoryName(name: string): AzureDevOpsRepositoryBuilder {
    this.repository.name = name;

    return this;
  }

  build(): AzureDevOpsRepositoryApiType {
    return this.repository;
  }
}

class GithubRepositoryBuilder {
  private repository = {} as GithubRepositoryApiType;

  constructor() {    
    this.repository.id = v4();
  }

  withRepositoryName(name: string): GithubRepositoryBuilder {
    this.repository.name = name;

    return this;
  }

  withRepositoryOwner(owner: string): GithubRepositoryBuilder {
    this.repository.owner = {
      login: owner
    };

    return this;
  }

  withRepositoryFullName(fullName: string): GithubRepositoryBuilder {
    this.repository.full_name = fullName;

    return this;
  }

  withRepositoryCloneUrl(cloneUrl: string): GithubRepositoryBuilder {
    this.repository.clone_url = cloneUrl;

    return this;
  }

  build(): GithubRepositoryApiType {
    return this.repository;
  }
}

class AzureDevOpsRepositoriesBuilder {
  private repositories = {} as AzureDevOpsRepositoriesApiType;

  withRepositories(...repositories: AzureDevOpsRepositoryApiType[]): AzureDevOpsRepositoriesBuilder {
    this.repositories.value = repositories;
    this.repositories.count = repositories.length;

    return this;
  }

  build(): AzureDevOpsRepositoriesApiType {
    return this.repositories;
  }
}

class GithubRepositoriesBuilder {
  private repositories = [] as GithubRepositoriesApiType;

  withRepositories(...repositories: GithubRepositoryApiType[]): GithubRepositoriesBuilder {
    this.repositories = repositories;

    return this;
  }

  build(): GithubRepositoriesApiType {
    return this.repositories;
  }

  buildSearch(): GithubSeachRepositoriesApiType {
    return {
      items: this.repositories
    } as GithubSeachRepositoriesApiType;
  }
}

export { AzureDevOpsRepositoriesBuilder, AzureDevOpsRepositoryBuilder, GithubRepositoriesBuilder, GithubRepositoryBuilder }