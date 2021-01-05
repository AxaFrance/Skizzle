import type { OrganizationType } from 'models/skizzle/OrganizationType';
import type { ProjectType } from 'models/skizzle/ProjectType';
import { ProviderEnum } from 'models/skizzle/ProviderEnum';
import type { RepositoryType } from 'models/skizzle/RepositoryType';
import { Service } from 'services/Service';
import {
	organizations,
	projects,
	pullRequests,
	repositories,
} from 'shared/stores/default.store';

export const checkOrganization = async (
	{ target },
	organization: OrganizationType,
) => {
	const { checked } = target as HTMLInputElement;

	organization.checked = checked;

	if (checked) {
		const values = (x: OrganizationType[]) =>
			[...x, organization].sort((a, b) =>
				a.organizationName.localeCompare(b.organizationName),
			);

		organizations.update(values);
	} else {
		organizations.update(x =>
			x.filter(y => y.organizationName !== organization.organizationName),
		);
		projects.update(x =>
			x.filter(y => y.organizationName !== organization.organizationName),
		);
		repositories.update(x =>
			x.filter(y => y.organizationName !== organization.organizationName),
		);
		pullRequests.update(x =>
			x.filter(y => y.organizationName !== organization.organizationName),
		);
	}
};

export const checkProject = async ({ target }, project: ProjectType) => {
	const { checked } = target as HTMLInputElement;

	project.checked = checked;

	projects.update(projects => {
		for (const value of projects) {
			if (value.projectId === project.projectId) {
				value.checked = checked;
			}
		}

		return projects;
	});

	if (!checked) {
		repositories.update(x => x.filter(y => y.projectId !== project.projectId));
		pullRequests.update(x => x.filter(y => y.projectId !== project.projectId));
	}
};

export const checkRepository = async (
	{ target },
	repository: RepositoryType,
) => {
	const { checked } = target as HTMLInputElement;

	repository.checked = checked;

	if (repository.provider === ProviderEnum.AzureDevOps) {
		repositories.update(repositories => {
			for (const value of repositories) {
				if (value.repositoryId === repository.repositoryId) {
					repository.checked = checked;
				}
			}

			return repositories;
		});
	}

	if (checked) {
		if (repository.provider === ProviderEnum.Github) {
			repositories.update(x => [...x, repository]);
		}

		const values = await Service.getPullRequests(repository.provider, {
			repository,
		});

		pullRequests.update(x =>
			[...x, ...values].sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
		);
	} else {
		if (repository.provider === ProviderEnum.Github) {
			repositories.update(x =>
				x.filter(y => y.repositoryId !== repository.repositoryId),
			);
		}
		pullRequests.update(x =>
			x.filter(y => y.repositoryId !== repository.repositoryId),
		);
	}
};

export const deleteRepository = async (repository: RepositoryType) => {
	repository.checked = false;

	if (repository.provider === ProviderEnum.AzureDevOps) {
		repositories.update(repositories => {
			for (const value of repositories) {
				if (value.repositoryId === repository.repositoryId) {
					repository.checked = repository.checked;
				}
			}

			return repositories;
		});
	}

	if (repository.provider === ProviderEnum.Github) {
		repositories.update(x =>
			x.filter(y => y.repositoryId !== repository.repositoryId),
		);
	}

	pullRequests.update(x =>
		x.filter(y => y.repositoryId !== repository.repositoryId),
	);
};
