<script>
	export let onClose;
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
		height: calc(100vh - 10rem);
		transform: translateX(-50%) translateY(-50%);
		border-radius: 8px;
		background-color: #5c5c5c;
		animation: fadeIn linear 0.3s;
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
	<div class="modale">
		<button on:click={onClose}>Fermer</button>
		<div class="content">
			<slot />
		</div>
	</div>
</div>
