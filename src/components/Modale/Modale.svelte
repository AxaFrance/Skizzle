<script lang="ts">
	export let onClose: () => void;
	export let fullHeight: boolean = true;
</script>

<style>
	.overlay {
		position: fixed;
		left: 0;
		top: 2rem;
		right: 0;
		bottom: 0;
		z-index: 2;
		backdrop-filter: blur(15px);
		background-color: rgba(0, 0, 0, 0.5);
		animation: fadeIn linear 0.3s;
	}
	.modale {
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 2;
		width: calc(100vw - 10rem);
		height: 100%;
		max-height: calc(100vh - 10rem);
		transform: translateX(-50%) translateY(-50%);
		border-radius: 8px;
		background-color: #333;
		animation: fadeIn linear 0.3s;
	}

	.full-height {
		height: calc(100vh - 10rem);
	}

	button {
		position: absolute;
		bottom: 100%;
		right: 0;
		padding: 0.5rem;
		font-weight: bold;
		color: #fff;
		cursor: pointer;
		font-size: 1rem;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
	}
	button:hover {
		opacity: 0.8;
	}
	.content {
		height: 100%;
		padding: 2rem;
		overflow: auto;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>

<div class="overlay">
	<div class={`modale ${fullHeight ? 'full-height' : ''}`}>
		<button on:click={onClose}>Fermer</button>
		<div class="content">
			<slot />
		</div>
	</div>
</div>
