<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AccountTitle from 'components/AccountTitle';
	import Button from 'components/Button';
	import Icons from 'components/icons';
	import Modale from 'components/Modale';

	export let confirmLabel: string;
	export let title: string;
	export let text: string;

	const dispatch = createEventDispatcher();
	const onConfirm = () => dispatch('confirm');
	const onCancel = () => dispatch('cancel');
</script>

<Modale onClose={onCancel} fullHeight={false}>
	<AccountTitle>{title}</AccountTitle>
	<p class="modale-content">
		{@html text}
	</p>
	<div class="modale-bar">
		<Button danger class="button" on:click={onConfirm}
			><Icons.Trash color="#fff" />{confirmLabel}</Button
		>
		<Button clear class="button" on:click={onCancel}>Cancel</Button>
	</div>
</Modale>

<style>
	.modale-bar {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 1rem;
	}

	.modale-bar :global(.button) {
		margin: 0 0.5rem;
	}

	.modale-content :global(b) {
		color: var(--color);
	}
</style>
