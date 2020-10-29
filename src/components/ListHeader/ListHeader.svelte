<script>
	import {
		pullRequests,
		refreshDelay,
		organizations,
		isFetchingPullRequests,
		profile,
		listIsFiltered,
		isOffline,
		language,
		event,
	} from '../../shared/store';
	import { getPullRequests } from '../../shared/requester';
	import Spider from '../Event/Halloween/Skeleton/Spider.svelte';
	import { onDestroy, onMount } from 'svelte';

	let canShow = false;
	let canEnd = false;
	let timeoutID: NodeJS.Timeout;
	const DELAY_BETWEEN_SPIDER_EVENT = 60000;
	const DELAY_DISPLAY_SPIDER_EVENT = 3000;

	const toggleFilter = () => {
		listIsFiltered.update(isFiltered => !isFiltered);
		getPullRequests({
			isFiltered: $listIsFiltered,
			organizations: $organizations,
			profileId: $profile.id,
		});
	};

	const onClick = () =>
		getPullRequests({
			organizations: $organizations,
			shouldNotify: true,
			isFiltered: $listIsFiltered,
			profileId: $profile.id,
		});

	const spiderEvent = (e: AnimationEvent) => {
		if (e.animationName.includes('inicio')) {
			setTimeout(() => (canEnd = true), DELAY_DISPLAY_SPIDER_EVENT);
		}
		if (e.animationName.includes('endSpider')) {
			canEnd = false;
			canShow = false;
			clearTimeout(timeoutID);

			timeoutID = setTimeout(() => {
				canShow = true;
			}, DELAY_BETWEEN_SPIDER_EVENT);
		}
	};

	onMount(() => {
		document.body.addEventListener('animationend', spiderEvent);
		timeoutID = setTimeout(() => {
			canShow = true;
		}, DELAY_BETWEEN_SPIDER_EVENT);
	});

	onDestroy(() => {
		document.body.removeEventListener('animationend', spiderEvent);
		clearTimeout(timeoutID);
	});
</script>

<style src="./ListHeader.scss">
</style>

<header class="skz-pullrequests-header">
	{#if $event.isHalloween && canShow}
		<Spider {canEnd} />
	{/if}
	<h1 class="skz-pullrequests-title">
		{$pullRequests.length} Pull request{$pullRequests.length > 1 ? 's' : ''}
		{#if !$isOffline}
			{#if !$refreshDelay && !$isFetchingPullRequests}
				<button class="skz-refresh-button" on:click={onClick}>
					{language.getWord('Refresh')}
				</button>
			{/if}
			{#if $isFetchingPullRequests}
				<small class="skz-fetching-status">{language.getWord('Updating')}</small>
			{/if}
		{/if}
	</h1>
	<button
		disabled={$isOffline}
		class="skz-pullrequests-filters"
		on:click={toggleFilter}>
		{$listIsFiltered ? language.getWord('ViewFullList') : language.getWord('FilterList')}
	</button>
</header>
