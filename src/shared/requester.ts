const app = require('electron').ipcRenderer;
import {
	getItem,
	existValue,
	updateSubItem,
	removeItem,
	addItem,
} from './storage';
import {
	pullRequests,
	profile,
	clientToken,
	organizations,
	isFetchingPullRequests,
	isFetchingProfile,
	pullRequestsFetchHasError,
} from './store';
import { getDiffDays } from './helpers';

let data: any[] = [];
let loadedRepositories = 0;
let loadedOrganizations = 0;
let numberOfLoadedPullRequests = 0;
let loadedPullRequests: any[] = [];
let brokenOrganizations: any[] = [];
let refreshing = false;

export const getHeader = () => {
	const headers = new window.Headers();
	headers.append('Content-Type', 'application/json');
	headers.append(
		'Authorization',
		`Bearer ${getItem('clientToken').clientToken}`,
	);

	const params = {
		method: 'GET',
		headers,
	};

	return params;
};

export const getToken = async ({
	url,
	redirect_uri,
	client_assertion,
	access_code,
	refresh_token,
}: {
	url: string;
	redirect_uri: string;
	client_assertion: string;
	access_code: string;
	refresh_token: string;
}) => {
	refreshing = true;
	const body = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${client_assertion}&grant_type=${
		refresh_token
			? 'refresh_token'
			: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
	}&assertion=${refresh_token || access_code}&redirect_uri=${redirect_uri}`;

	const headers = new window.Headers();
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	headers.append('Content-Length', body.length.toString());

	const result = await fetch(url, {
		method: 'POST',
		body,
		headers,
	});

	if (result.ok) {
		const value = await result.json();

		const { token, access_token, expires_in, refresh_token } = value;

		let checkToken = token;

		if (!checkToken) {
			checkToken = access_token;
		}

		if (!checkToken) {
			removeItem('clientToken');
			throw new Error('No token recieved!');
		}

		const current_date = new Date();
		const expiresIn = parseInt(expires_in);

		addItem('clientToken', {
			clientToken: checkToken,
			refresh_token,
			expires_in: expiresIn,
			url,
			redirect_uri,
			client_assertion,
			current_date,
		});
		clientToken.set({
			clientToken: checkToken,
			refresh_token,
			expires_in: expiresIn,
			url,
			redirect_uri,
			client_assertion,
			current_date,
		});
	}

	refreshing = false;
};

export const customFetch = async (url: string) => {
	const client = getItem('clientToken');

	if (!client) {
		clientToken.set(undefined);
		clear();

		throw new Error("Token doesn't exist!");
	}

	const diffSecondes = Math.abs(
		(new Date(client.current_date).getTime() - new Date().getTime()) / 1000,
	);

	if (diffSecondes > client.expires_in && !refreshing) {
		await getToken(client);
	}

	const params = getHeader();

	return await fetch(url, params);
};

export const getMemberName = async memberId => {
	const res = await customFetch(
		`https://app.vssps.visualstudio.com/_apis/profile/profiles/${memberId}?api-version=5.1`,
	);

	if (res.ok) {
		const data = await res.json();
		return data.displayName;
	}

	return '';
};

export const getProfile = async () => {
	isFetchingProfile.set(true);

	const res = await customFetch(
		'https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=5.1-preview.3',
	);

	if (res.ok) {
		res
			.json()
			.then(user => {
				profile.set(user);
				clientToken.set(getItem('clientToken'));
				getOrganizations(user.id);
			})
			.catch(() => {
				clientToken.set(undefined);
				removeItem('clientToken');
				isFetchingProfile.set(false);
				profile.set({
					...profile,
					hasError: true,
				});
			});
	} else {
		profile.set({
			...profile,
			hasError: true,
		});
		isFetchingProfile.set(false);
		throw new Error(res.statusText);
	}
};

export const getOrganizations = async (id: string) => {
	const res = await customFetch(
		`https://app.vssps.visualstudio.com/_apis/accounts?memberId=${id}&api-version=5.1-preview.1`,
	);

	if (res.ok) {
		const result = await res.json();

		if (result && result.count > 0) {
			const firstOrganization = result.value[0].accountName;

			profile.update(user => ({
				...user,
				avatar: getDescriptor(id).then(descriptor =>
					getAvatar(id, firstOrganization, descriptor.value),
				),
			}));
		}

		data.push(
			...result.value.map((organization: any) => ({
				...organization,
				checked: existValue(getItem('organizations'), organization.accountId),
			})),
		);

		data.forEach(organization =>
			getProjects({ organization, numberOfOrganizations: result.value.length }),
		);
	} else {
		profile.update(user => ({
			...user,
			hasError: true,
		}));
		isFetchingProfile.set(false);
		throw new Error(res.statusText);
	}
};

export const getProjects = async ({
	organization,
	numberOfOrganizations,
}: {
	organization: any;
	numberOfOrganizations: number;
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organization.accountName}/_apis/projects?$top=1000&api-version=5.1`,
	);

	let result = {
		value: [],
	};

	if (res.ok) {
		result = await res.json();
	} else {
		brokenOrganizations.push(organization.accountName);
	}

	loadedOrganizations += 1;

	data = data.map(organizationItem => ({
		...organizationItem,
		isBroken: brokenOrganizations.includes(organizationItem.accountName),
		projects:
			organizationItem.accountId === organization.accountId
				? result.value
				: organizationItem.projects,
	}));

	if (loadedOrganizations === numberOfOrganizations) {
		const numberOfProjects = data.reduce((acc, curr) => {
			acc += curr.projects ? curr.projects.length : 0;
			return acc;
		}, 0);

		data.forEach(organizationItem => {
			if (organizationItem.projects) {
				organizationItem.projects.forEach(({ id: projectId }: { id: string }) =>
					getRepositories({
						projectId,
						organizationName: organizationItem.accountName,
						numberOfProjects,
					}),
				);
			}
		});
	}
};

export const getRepositories = async ({
	projectId,
	organizationName,
	numberOfProjects,
}: {
	projectId: string;
	organizationName: string;
	numberOfProjects: number;
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organizationName}/${projectId}/_apis/git/repositories?includeLinks=true&api-version=5.0`,
	);

	if (res.ok) {
		const result = await res.json();

		data = data.map(organizationItem => {
			const newOrganizationItem = { ...organizationItem };

			if (organizationItem.accountName === organizationName) {
				newOrganizationItem.projects = newOrganizationItem.projects.map(
					(project: any) => {
						const newProject = { ...project };

						if (project.id === projectId) {
							newProject.repositories = result.value
								.map((repository: any) => {
									const checked = getItem('repositories') || [];

									return {
										...repository,
										checked: checked.includes(repository.id),
									};
								})
								.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
						}

						return newProject;
					},
				);
			}

			return newOrganizationItem;
		});

		loadedRepositories += 1;

		if (loadedRepositories === numberOfProjects) {
			isFetchingProfile.set(false);
			organizations.set(data);
		}
	} else {
		throw new Error(res.statusText);
	}
};

export const updatePullRequestsStore = ({
	shouldNotify = false,
	isFiltered = false,
	profileId,
}: {
	shouldNotify: boolean;
	isFiltered: boolean;
	profileId: string;
}) => {
	pullRequests.update(pullRequestsList => {
		const newList = loadedPullRequests.reduce((acc, curr) => {
			acc.push(...curr);
			return acc;
		}, []);
		const filteredList = isFiltered
			? newList.filter((item: any) => {
					return (
						item.isDraft === false &&
						item.mergeStatus !== 'conflicts' &&
						profileId !== item.createdBy.id &&
						getDiffDays(item.creationDate) < 30 &&
						!item.reviewers.find(({ id }: { id: string }) => id === profileId)
					);
			  })
			: newList;

		if (
			shouldNotify &&
			pullRequestsList.length &&
			pullRequestsList.length < filteredList.length
		) {
			const newPullRequests = filteredList.filter(
				(item: any) =>
					!pullRequestsList.find(
						({ pullRequestId }) => pullRequestId === item.pullRequestId,
					),
			);

			if (newPullRequests.length) {
				let title = 'Nouvelle pull request';
				let body = `Le projet ${newPullRequests[0].repository.project.name} a une nouvelle pull request.`;

				if (newPullRequests.length > 1) {
					const projectsNames = newPullRequests.reduce((acc: any, curr: any) => {
						if (!acc.includes(curr.repository.project.name)) {
							acc.push(curr.repository.project.name);
						}
						return acc;
					}, []);

					title = 'Nouvelles pull requests';
					body = `Les projets ${projectsNames.reduce((acc: any, curr: any) => {
						acc = `${curr}, `;
						return acc;
					}, '')} ont de nouvelles pull requests`;
				}

				app.send('notifier', {
					title,
					body,
				});
			}
		}

		return filteredList.sort(
			(a: any, b: any) =>
				new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
		);
	});

	loadedPullRequests = [];
};

export const checkedElements = ({ checked }: { checked: boolean }) => !!checked;
export const getCheckedRepositories = (
	allProjects: any,
	{
		projects,
		accountName: organizationName,
	}: { projects: any; accountName: string },
) => {
	allProjects.push(
		...projects.reduce(
			(allRepositories: any, { repositories }: { repositories: any }) => {
				allRepositories.push(
					...repositories
						.filter(checkedElements)
						.map(
							({
								id,
								creationDate,
								project: { id: projectId },
							}: {
								id: string;
								creationDate: string;
								project: { id: string };
							}) => ({
								id,
								projectId,
								organizationName,
								creationDate,
							}),
						),
				);
				return allRepositories;
			},
			[],
		),
	);
	return allProjects;
};

export const getPullRequests = async ({
	organizations,
	shouldNotify = false,
	isFiltered,
	profileId,
}: {
	organizations: any;
	shouldNotify: boolean;
	isFiltered: boolean;
	profileId: string;
}) => {
	pullRequestsFetchHasError.set(false);
	numberOfLoadedPullRequests = 0;
	if (organizations.length) {
		const repositoriesToFetch = organizations
			.filter(checkedElements)
			.reduce(getCheckedRepositories, []);
		if (repositoriesToFetch.length) {
			isFetchingPullRequests.set(true);
			repositoriesToFetch.forEach((repo: any) =>
				fetchPullRequests({
					...repo,
					shouldNotify,
					isFiltered,
					profileId,
					repositoriesToFetch,
				}),
			);
		} else {
			updatePullRequestsStore({ shouldNotify, isFiltered, profileId });
		}
	}
};

export const fetchPullRequests = async ({
	id,
	projectId,
	organizationName,
	shouldNotify,
	isFiltered,
	profileId,
	repositoriesToFetch,
}: {
	id: string;
	projectId: string;
	organizationName: string;
	shouldNotify: boolean;
	isFiltered: boolean;
	profileId: string;
	repositoriesToFetch: any[];
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organizationName}/${projectId}/_apis/git/repositories/${id}/pullRequests?searchCriteria.status=active&includeLinks=true&api-version=5.0`,
	);

	if (res.ok && res.status === 200) {
		const result = await res.json();

		loadedPullRequests.push(
			result.value.map((value: any[]) => ({ ...value, organizationName })),
		);
	} else {
		pullRequestsFetchHasError.set(true);
	}

	numberOfLoadedPullRequests += 1;

	if (numberOfLoadedPullRequests === repositoriesToFetch.length) {
		isFetchingPullRequests.set(false);
		updatePullRequestsStore({ shouldNotify, isFiltered, profileId });
	}
};

export const fetchPullRequestComments = async ({
	pullRequestId,
	repositoryId,
	projectId,
	organizationName,
}: {
	pullRequestId: string;
	repositoryId: string;
	projectId: string;
	organizationName: string;
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organizationName}/${projectId}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=5.1`,
	);

	if (res.ok) {
		return await res.json();
	} else {
		throw new Error(res.statusText);
	}
};

export const getAvatar = async (
	userId: string,
	organization: string,
	subjectDescriptor: string,
) => {
	const imgs = getItem('images');
	let avatar;

	if (imgs && imgs.length > 0) {
		avatar = imgs.find((x: any) => x[userId]);
	}

	if (avatar) {
		return Promise.resolve({ value: avatar[userId] });
	}
	const res = await customFetch(
		`https://vssps.dev.azure.com/${organization}/_apis/graph/Subjects/${subjectDescriptor}/avatars?size=large&api-version=5.1-preview.1`,
	);

	if (res.ok) {
		const response = res.json();

		response.then(x => {
			updateSubItem('images', userId, x.value);
		});

		return response;
	} else {
		throw new Error(res.statusText);
	}
};

export const getDescriptor = async (userId: string) => {
	const response = await customFetch(
		`https://vssps.dev.azure.com/_apis/graph/descriptors/${userId}?api-version=5.0-preview.1`,
	);

	if (response.ok) {
		return response.json();
	} else {
		throw new Error(response.statusText);
	}
};

export const clear = () => {
	data = [];
	loadedRepositories = 0;
	loadedOrganizations = 0;
	loadedPullRequests = [];
	numberOfLoadedPullRequests = 0;
};

export const getPullRequestFiles = async (
	projectId,
	repositoryId,
	organization,
	pullRequestId,
) => {
	const response = await customFetch(
		`https://dev.azure.com/${organization}/${projectId}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/attachments/?api-version=5.1-preview.1`,
	);

	if (response.ok) {
		return response.json();
	}
	throw new Error(response.statusText);
};
