<script lang="ts">
	import { v4 as uuid } from 'uuid';
	export let checked: boolean = false;
	export let label: string;

	let className: string = '';
	export { className as class };

	let id = uuid();
</script>

<div class={`checkbox ${className}`}>
	<input on:change {id} type="checkbox" bind:checked />
	<label for={id}>{label}</label>
</div>

<style>
	.checkbox {
		display: flex;
	}

	label {
		position: relative;
		display: inline-flex;
		align-items: center;
		line-height: 1;
		cursor: pointer;
	}

	input {
		opacity: 0;
		position: absolute;
	}

	label:before {
		content: '';
		display: block;
		width: 1.1rem;
		height: 1.1rem;
		margin-right: 0.5rem;
		border-radius: 2px;
		background-color: #fff;
	}

	input + label:after {
		content: '';
		position: absolute;
		left: 3px;
		top: 3px;
		width: calc(1.1rem - 6px);
		height: calc(1.1rem - 6px);
		border-radius: 2px;
		background-color: var(--color);
		transform: scale(0);
		transition: transform linear 0.2s;
	}

	input:checked + label:after {
		transform: scale(1);
	}

	input:focus + label:before {
		box-shadow: 0 0 0 2px var(--color);
	}
</style>
