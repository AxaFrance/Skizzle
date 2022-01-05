<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import Icons from 'components/icons';
	import { createEventDispatcher } from 'svelte';
	export let value: string[] = [];
	export let label: string;
	export let list: { [key: string]: string };
	export let placeholder: string = '';
	export let noMatchError: string = `This query doesn't match any item of the list.`;
	export let alreadySelectedError: string = 'Already selected.';
	export let allowFreeInput: boolean = false;

	const dispatch = createEventDispatcher();

	let query = '';
	$: displayedValue = value.map(item => list[item] || item);
	let noMatch = false;
	let alreadySelected = false;
	let id = uuidv4();

	const onUnselect = itemToDelete => () => {
		if (allowFreeInput) {
			value = value.filter(item => item !== itemToDelete);
			displayedValue = displayedValue.filter(item => item !== itemToDelete);
		} else {
			const matchedItemId = Object.entries(list).find(item => item[1] === itemToDelete);
			value = value.filter(item => item !== matchedItemId[0]);
			displayedValue = displayedValue.filter(item => item !== itemToDelete);
		}
		dispatch('change', { value });
	};

	const onInput = () => {
		noMatch = false;
		alreadySelected = false;
	};

	const onChange = e => {
		const matchedItemId = Object.entries(list).find(item => item[1] === e.target.value);

		e.target.blur();
		e.target.focus();
		noMatch = false;
		alreadySelected = false;

		if (matchedItemId) {
			if (value.includes(matchedItemId[0])) {
				alreadySelected = true;
			} else {
				value.push(matchedItemId[0]);
				displayedValue = [...displayedValue, list[matchedItemId[0]]];
				query = '';
				dispatch('change', { value });
			}
		} else {
			if (allowFreeInput) {
				if (value.includes(e.target.value)) {
					alreadySelected = true;
				} else {
					value.push(e.target.value);
					displayedValue = [...displayedValue, e.target.value];
					query = '';
					dispatch('change', { value });
				}
			} else {
				noMatch = true;
			}
		}
	};
</script>

{#if label}
	<label for="selector">{label}</label>
{/if}

<div class="container">
	<input
		{placeholder}
		id="selector"
		bind:value={query}
		on:change={onChange}
		on:input={onInput}
		list={id}
	/>
	{#if query && noMatch}
		<span class="message">{noMatchError}</span>
	{/if}
	{#if query && alreadySelected}
		<span class="message">{alreadySelectedError}</span>
	{/if}
</div>
<datalist {id}>
	{#each Object.values(list) as name}
		<option value={name} />{/each}
</datalist>
{#if displayedValue.length}
	<ul class="tag-list">
		{#each displayedValue as item}
			<li class="tag">
				{item}
				<button
					class="delete"
					title={`Unselect ${item} repository`}
					aria-label={`Unselect ${item} repository`}
					on:click={onUnselect(item)}
				>
					<Icons.Delete size="16" aria-hidden="true" />
					{`Unselect ${item} repository`}
				</button>
			</li>
		{/each}
	</ul>
{/if}

<style>
	.container {
		position: relative;
		margin-bottom: 0.25rem;
	}

	.message {
		position: absolute;
		right: 3rem;
		top: 50%;
		color: #fff;
		font-size: 0.8rem;
		transform: translateY(-50%);
	}

	label {
		display: inline-block;
		margin-bottom: 0.5rem;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
	}

	.tag {
		display: flex;
		align-items: center;
		margin-top: 0.25rem;
		margin-right: 0.25rem;
		padding: 0.2rem 0.5rem;
		font-size: 1rem;
		border-radius: 4px;
		background-color: var(--color);
	}

	input {
		width: 100%;
		padding: 0.5rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		background-color: #555;
	}

	.delete {
		margin-left: 0.5rem;
		font-size: 0;
		border: none;
		background-color: transparent;
	}
</style>
