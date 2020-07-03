const { ipcRenderer } = require('electron');
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
import { ORGANIZATIONS, IMAGES } from './constant';
import { getDiffDays } from './helpers';

let data = [];
let loadedRepositories = 0;
let loadedOrganizations = 0;
let numberOfLoadedPullRequests = 0;
let loadedPullRequests = [];
let brokenOrganizations = [];
let refreshing = false;

export const getHeader = () => {
	const headers = new window.Headers();
	headers.append('Content-Type', 'application/json');
	headers.append(
		'Authorization',
		`Bearer ${getItem('clientToken').clientToken}`,
	);

	let params = {
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
}) => {
	refreshing = true;
	const body = `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${client_assertion}&grant_type=${
		refresh_token
			? 'refresh_token'
			: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
	}&assertion=${
		refresh_token ? refresh_token : access_code
	}&redirect_uri=${redirect_uri}`;

	const headers = new window.Headers();
	headers.append('Content-Type', 'application/x-www-form-urlencoded');
	headers.append('Content-Length', body.length);

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
	} else {
		removeItem('clientToken');
		isFetchingProfile.set(false);
		profile.set({
			...profile,
			hasError: true,
		});
	}

	refreshing = false;
};

export const customFetch = async (url, onError = undefined) => {
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
		throw new Error(res);
	}
};

export const getOrganizations = async id => {
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
			...result.value.map(organization => ({
				...organization,
				checked: existValue(getItem(ORGANIZATIONS), organization.accountId),
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
		throw new Error(res);
	}
};

export const getProjects = async ({ organization, numberOfOrganizations }) => {
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
				organizationItem.projects.forEach(({ id: projectId }) =>
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
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organizationName}/${projectId}/_apis/git/repositories?includeLinks=true&api-version=5.0`,
	);

	if (res.ok) {
		const result = await res.json();

		data = data.map(organizationItem => {
			let newOrganizationItem = { ...organizationItem };

			if (organizationItem.accountName === organizationName) {
				newOrganizationItem.projects = newOrganizationItem.projects.map(project => {
					const newProject = { ...project };

					if (project.id === projectId) {
						newProject.repositories = result.value
							.map(repository => {
								const checked = getItem('repositories') || [];

								return {
									...repository,
									checked: checked.includes(repository.id),
								};
							})
							.sort((a, b) => (a.name > b.name ? 1 : -1));
					}

					return newProject;
				});
			}

			return newOrganizationItem;
		});

		loadedRepositories += 1;

		if (loadedRepositories === numberOfProjects) {
			isFetchingProfile.set(false);
			organizations.set(data);
		}
	} else {
		throw new Error(res);
	}
};

export const updatePullRequestsStore = ({
	shouldNotify = false,
	isFiltered = false,
	profileId,
}) => {
	pullRequests.update(pullRequestsList => {
		const newList = loadedPullRequests.reduce((acc, curr) => {
			acc.push(...curr);
			return acc;
		}, []);
		const filteredList = isFiltered
			? newList.filter(item => {
					return (
						item.isDraft === false &&
						item.mergeStatus !== 'conflicts' &&
						profileId !== item.createdBy.id &&
						getDiffDays(item.creationDate) < 30 &&
						!item.reviewers.find(({ id }) => id === profileId)
					);
			  })
			: newList;

		if (
			shouldNotify &&
			pullRequestsList.length &&
			pullRequestsList.length < filteredList.length
		) {
			const newPullRequests = filteredList.filter(
				item =>
					!pullRequestsList.find(
						({ pullRequestId }) => pullRequestId === item.pullRequestId,
					),
			);

			if (newPullRequests.length) {
				let title = 'Nouvelle pull request';
				let body = `Le projet ${newPullRequests[0].repository.project.name} a une nouvelle pull request.`;

				if (newPullRequests.length > 1) {
					const projectsNames = newPullRequests.reduce((acc, curr) => {
						if (!acc.includes(curr.repository.project.name)) {
							acc.push(curr.repository.project.name);
						}
						return acc;
					}, []);

					title = 'Nouvelles pull requests';
					body = `Les projets ${projectsNames.reduce((acc, curr) => {
						acc = `${curr}, `;
						return acc;
					}, '')} ont de nouvelles pull requests`;
				}

				ipcRenderer.send('notifier', {
					title,
					body,
				});
			}
		}

		return filteredList.sort(
			(a, b) => new Date(b.creationDate) - new Date(a.creationDate),
		);
	});

	numberOfLoadedPullRequests = 0;
	loadedPullRequests = [];
};

export const checkedElements = ({ checked }) => !!checked;
export const getCheckedRepositories = (
	allProjects,
	{ projects, accountName: organizationName },
) => {
	allProjects.push(
		...projects.reduce((allRepositories, { repositories }) => {
			allRepositories.push(
				...repositories
					.filter(checkedElements)
					.map(({ id, creationDate, project: { id: projectId } }) => ({
						id,
						projectId,
						organizationName,
						creationDate,
					})),
			);
			return allRepositories;
		}, []),
	);
	return allProjects;
};

export const getPullRequests = async ({
	organizations,
	shouldNotify = false,
	isFiltered,
	profileId,
}) => {
	pullRequestsFetchHasError.set(false);
	numberOfLoadedPullRequests = 0;
	if (organizations.length) {
		const repositoriesToFetch = organizations
			.filter(checkedElements)
			.reduce(getCheckedRepositories, []);
		if (repositoriesToFetch.length) {
			isFetchingPullRequests.set(true);
			repositoriesToFetch.forEach(repo =>
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
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organizationName}/${projectId}/_apis/git/repositories/${id}/pullRequests?searchCriteria.status=active&includeLinks=true&api-version=5.0`,
	);

	if (res.ok && res.status === 200) {
		const result = await res.json();

		loadedPullRequests.push(
			result.value.map(value => ({ ...value, organizationName })),
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
}) => {
	const res = await customFetch(
		`https://dev.azure.com/${organizationName}/${projectId}/_apis/git/repositories/${repositoryId}/pullRequests/${pullRequestId}/threads?api-version=5.1`,
	);

	if (res.ok) {
		return await res.json();
	} else {
		throw new Error(res);
	}
};

export const getAvatar = async (userId, organization, subjectDescriptor) => {
	const imgs = getItem(IMAGES);
	let avatar;

	if (imgs && imgs.length > 0) {
		avatar = imgs.find(x => x[userId]);
	}

	if (avatar) {
		return Promise.resolve({ value: avatar[userId] });
	} else {
		const res = await customFetch(
			`https://vssps.dev.azure.com/${organization}/_apis/graph/Subjects/${subjectDescriptor}/avatars?size=large&api-version=5.1-preview.1`,
		);

		if (res.ok) {
			const response = res.json();

			response.then(x => {
				updateSubItem(IMAGES, userId, x.value);
			});

			return response;
		} else {
			throw new Error(res);
		}
	}
};

export const getDescriptor = async userId => {
	const response = await customFetch(
		`https://vssps.dev.azure.com/_apis/graph/descriptors/${userId}?api-version=5.0-preview.1`,
	);

	if (response.ok) {
		return response.json();
	} else {
		throw new Error(response);
	}
};

export const clear = () => {
	data = [];
	loadedRepositories = 0;
	loadedOrganizations = 0;
	loadedPullRequests = [];
	numberOfLoadedPullRequests = 0;
};
