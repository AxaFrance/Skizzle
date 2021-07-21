<script lang="ts">
	import { isFetchingData, isLoading } from '../../shared/stores/default.store';
</script>

{#if $isLoading || $isFetchingData}
	<div />
{/if}

<style>
	div {
		animation: fadeIn 0.2s;
		position: fixed;
		top: 2rem;
		left: 8rem;
		right: 0;
		overflow: hidden;
		height: 0.2rem;
		background-color: #4e4e4e;
		border-radius: 45px;
	}

	div:before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 50%;
		height: 100%;
		background-color: var(--color);
		animation: loader 1.2s infinite ease-in-out;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes loader {
		0% {
			opacity: 0;
			transform: translateX(-100%);
		}

		50% {
			opacity: 1;
		}

		100% {
			opacity: 0;
			transform: translateX(100vw);
		}
	}
</style>
