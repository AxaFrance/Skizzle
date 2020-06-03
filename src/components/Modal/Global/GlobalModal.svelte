<script>
	import { setContext } from 'svelte';
	import { fade } from 'svelte/transition';

	export let key = 'modal';
	export let transitionBg = fade;
	export let transitionBgProps = { duration: 250 };
	export let transitionWindow = transitionBg;
	export let transitionWindowProps = transitionBgProps;

	const defaultState = {
		transitionBg,
		transitionBgProps,
		transitionWindow,
		transitionWindowProps,
	};
	let state = { ...defaultState };

	let Component = null;
	let props = null;

	let background;
	let wrap;

	$: currentTransitionBg = state.transitionBg;
	$: currentTransitionWindow = state.transitionWindow;

	const open = (NewComponent, newProps = {}) => {
		Component = NewComponent;
		props = newProps;
		state = { ...defaultState };
	};

	const close = (callback = {}) => {
		Component = null;
		props = null;
	};

	const handleKeyup = ({ key }) => {
		if (Component && key === 'Escape') {
			event.preventDefault();
			close();
		}
	};

	const handleOuterClick = event => {
		if (event.target === background || event.target === wrap) {
			event.preventDefault();
			close();
		}
	};

	setContext(key, { open, close });
</script>

<style src="./GlobalModal.scss">

</style>

<svelte:window on:keyup={handleKeyup} />

{#if Component}
	<div
		class="skz-glModal-bg"
		on:click={handleOuterClick}
		bind:this={background}
		transition:currentTransitionBg={state.transitionBgProps}>
		<div class="skz-glModal-window-wrap" bind:this={wrap}>
			<div
				class="skz-glModal-window"
				transition:currentTransitionWindow={state.transitionWindowProps}>
				<button on:click={close} class="skz-glModal-close" />
				<div class="skz-glModal-content">
					<svelte:component this={Component} {...props} />
				</div>
			</div>
		</div>
	</div>
{/if}
<slot />
