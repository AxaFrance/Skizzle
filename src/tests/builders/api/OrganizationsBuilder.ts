import type { AzureDevOpsOrganizationsApiType, AzureDevOpsOrganizationApiType, GithubOrganizationsApiType, GithubOrganizationApiType } from '../../../models/api/OrganizationsApiType';

class AzureDevOpsOrganizationsBuilder {
  private organizations = {} as AzureDevOpsOrganizationsApiType;

  withOrganization(organization: AzureDevOpsOrganizationApiType): AzureDevOpsOrganizationsBuilder {
    this.organizations.value = [...this.organizations.value, organization];

    return this;
  }

  withOrganizationDetails(name?: string, id?: string): AzureDevOpsOrganizationsBuilder {
    this.organizations.value = [...this.organizations.value, ({
      accountName: name,
      accountId: id
    })];
    
    return this;
  }

  build(): AzureDevOpsOrganizationsApiType {
    return this.organizations;
  }
}

class GithubOrganizationsBuilder {
  private organizations = [] as GithubOrganizationsApiType;

  withOrganization(organization: GithubOrganizationApiType): GithubOrganizationsBuilder {
    this.organizations = [...this.organizations, organization];

    return this;
  }

  withOrganizationDetails(name?: string, id?: string): GithubOrganizationsBuilder {
    this.organizations = [...this.organizations, ({
      login: name,
      id: id
    })];
    
    return this;
  }

  build(): GithubOrganizationsApiType {
    return this.organizations;
  }
}

export { AzureDevOpsOrganizationsBuilder, GithubOrganizationsBuilder }