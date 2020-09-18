<script>
	import { onDestroy } from 'svelte';
	import {
		pullRequests,
		refreshDelay,
		organizations,
		isFetchingPullRequests,
		pullRequestsFetchHasError,
		isFetchingProfile,
		profile,
		listIsFiltered,
		isOffline,
		language,
	} from '../../shared/store';
	import { getPullRequests } from '../../shared/requester';
	import Pullrequest from '../Pullrequest';
	import ErrorMessage from '../ErrorMessage';
	import Loader from '../Loader';
	import ListHeader from '../ListHeader';
	import Tag from '../Tag';
	import { GlobalModal } from '../Modal';

	let interval;
	let selected = [];

	const stopRefresh = () => {
		if (interval) {
			clearInterval(interval);
		}
	};

	const startRefresh = (newDelay = $refreshDelay) => {
		let delay = newDelay * 1000 * 60;

		stopRefresh();

		if (delay) {
			interval = setInterval(
				() =>
					getPullRequests({
						isFiltered: $listIsFiltered,
						organizations: $organizations,
						shouldNotify: true,
						profileId: $profile.id,
					}),
				delay,
			);
		}
	};

	refreshDelay.subscribe(startRefresh);

	onDestroy(stopRefresh);

	organizations.subscribe(organizationsList => {
		if (organizationsList.length && $profile) {
			getPullRequests({
				isFiltered: $listIsFiltered,
				organizations: organizationsList,
				profileId: $profile.id,
			});
		}
	});

	isOffline.subscribe(value => {
		if (value) {
			stopRefresh();
		} else {
			startRefresh();
		}
	});

	const addOptions = (labels, options) => {
		labels.forEach((element, index) => {
			options.push(element);
		});
	};

	const getAllTags = pullRequests => {
		let tags = pullRequests.reduce((acc, curr) => {
			if (curr.labels) {
				let labels =
					curr.labels.reduce((accLabels, currLabel) => {
						if (currLabel.active) {
							accLabels.push(currLabel.name);
						}
						return accLabels;
					}, []) || [];

				addOptions(labels, acc);
			}
			return acc;
		}, []);

		let tmp = [],
			prev;

		tags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
		for (let i = 0; i < tags.length; i++) {
			let current = tags[i].toLowerCase();

			if (current !== prev) {
				tmp.push({
					value: tags[i],
					count: 1,
				});
			} else {
				let value = tmp[tmp.length - 1];
				tmp[tmp.length - 1] = {
					...value,
					count: ++value.count,
				};
			}

			prev = current;
		}

		tmp.sort((a, b) => (a.count - b.count) * -1);

		return tmp.reduce((acc, curr) => (acc = [...acc, curr.value]), []);
	};

	const setTag = ({ detail }) => {
		if (detail.checked) {
			selected = [...selected, detail.tag.toLowerCase()];
		} else {
			if (selected.includes(detail.tag.toLowerCase())) {
				selected = selected.filter(x => x !== detail.tag.toLowerCase());
			}
		}
	};

	const manualRefresh = () =>
		getPullRequests({
			isFiltered: $listIsFiltered,
			organizations: $organizations,
			shouldNotify: true,
			profileId: $profile.id,
		});

	$: tags = getAllTags($pullRequests);
	$: numberOfCheckedOrganizations = $organizations.filter(
		({ checked }) => checked,
	).length;
	$: searchablePullRequests =
		selected.length > 0
			? $pullRequests.filter(
					x =>
						x.labels &&
						x.labels.filter(y => y.active && selected.includes(y.name.toLowerCase()))
							.length > 0,
			  )
			: $pullRequests;
	let show = false;
</script>

<style src="./MainView.scss">

</style>

<GlobalModal>
	{#if $isFetchingPullRequests}
		<Loader />
	{:else}
		{#if searchablePullRequests.length}
			<ListHeader />
		{/if}
		{#if !$isFetchingProfile}
			<div class="skz-pullrequests__list-container">
				{#if tags && tags.length > 0}
					<ul
						class="skz-pullrequests__list {show ? 'skz-pullrequests__list--show' : ''}">
						{#each tags as tag}
							<Tag {tag} on:tag={setTag} />
						{/each}
					</ul>
					<button
						class="skz-pullrequests__list-more"
						on:click={() => (show = !show)}>
						{language.getWord('show')}
						{show ? language.getWord('less') : language.getWord('more')}...
					</button>
				{/if}
			</div>
			<ul class="skz-pullrequests-list">
				{#each searchablePullRequests as pullRequest}
					<Pullrequest {pullRequest} />
				{:else}
					<li>
						<p class="skz-pullrequests-list__empty">
							{language.getWord('PullRequestsEmpty')}
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}
</GlobalModal>
