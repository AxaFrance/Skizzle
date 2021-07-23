<script lang="ts">
	import Icons from '../icons';
	import { isFetchingData, offline } from '../../shared/stores/default.store';
	
	export let onClick: () => void;
	export let text: string;
</script>

<style>
	div {
		padding: 1rem;
		text-align: center;
		border-radius: 8px;
		background-color: #5c5c5c;
	}

	button {
		position: relative;
		padding: 1rem 1rem 1rem 2.5rem;
		color: #fff;
		font-size: 1rem;
		border: none;
		background-color: transparent;
	}

	div :global(.icon) {
		position: absolute;
		left: 0.5rem;
		top: 50%;
		width: 1.5rem;
		transform: translateY(-50%);
	}
</style>

<div>
	<button role="button" title={text} on:click={onClick} disabled={$isFetchingData || $offline}><Icons.AddAccount />{text}</button>
</div>
