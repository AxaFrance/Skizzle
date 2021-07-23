import type { AzureDevOpsProfileApiType } from '../../../models/api/ProfileApiType';

class AzureDevOpsProfileBuilder {
  private profile = {} as AzureDevOpsProfileApiType;

  withDisplayName(displayName: string): AzureDevOpsProfileBuilder {
    this.profile.displayName = displayName;

    return this;
  }

  withEmailAddress(emailAddress: string): AzureDevOpsProfileBuilder {
    this.profile.emailAddress = emailAddress;

    return this;
  }

  withId(id: string): AzureDevOpsProfileBuilder {
    this.profile.id = id;

    return this;
  }

  withAvatar(): AzureDevOpsProfileBuilder {
    this.profile.coreAttributes = ({
      Avatar: {
        value : {
          value: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII='
        }
      }
    });

    return this;
  }

  build(): AzureDevOpsProfileApiType {
    return this.profile;
  }
}

export { AzureDevOpsProfileBuilder }