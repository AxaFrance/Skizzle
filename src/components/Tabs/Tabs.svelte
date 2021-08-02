<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import Icons from 'components/icons';
	import type { TabsType } from 'models/skizzle/TabsType';
	import type { TabType } from 'models/skizzle/TabType';

	type TabsPropsType = {
		data: TabsType;
		current: any;
		onChange: (value: any) => void;
		onCreation?: () => void;
		onSave?: (tabs: TabsType) => void;
	};

	export let { data, current, onCreation, onChange, onSave } = <TabsPropsType>(
		$$props
	);

	let initialDragPosition = 0;
	let lastPosition: number;
	let shadowTabs: TabsType = {};
	let minDragPosition = 0;
	let maxDragPosition = 0;
	let tabs = { ...data };

	const sortTabs = (tabs: TabsType): TabsType => {
		return Object.entries(tabs)
			.sort(([a], [b]) => {
				if (tabs[a].sortable) return -1;
				if (tabs[b].sortable) return 1;
				return 0;
			})
			.sort(([a], [b]) => {
				if (tabs[a].order < tabs[b].order) return -1;
				if (tabs[a].order > tabs[b].order) return 1;
				return 0;
			})
			.reduce((sortedTabs, [id, tab]) => ({ ...sortedTabs, [id]: tab }), {});
	};

	const getDirection = (
		lastPosition: number,
		currentPosition: number,
	): number => {
		if (lastPosition < currentPosition) {
			return 1;
		}

		if (lastPosition > currentPosition) {
			return -1;
		}

		return 0;
	};

	const switchTab = (
		tab: TabType,
		sideTab: TabType,
		direction: number,
	): TabsType => {
		const switchedTabs = {
			...shadowTabs,
			[tab.id]: {
				...tab,
				order: sideTab.order,
				left: tab.left + tab.width * direction,
			},
			[sideTab.id]: {
				...sideTab,
				order: tab.order,
				left: sideTab.left - tab.width * direction,
			},
		};

		const translatePosition =
			Math.abs(switchedTabs[sideTab.id].order - tabs[sideTab.id].order) *
			switchedTabs[tab.id].width *
			direction *
			-1;

		switchedTabs[
			sideTab.id
		].element.style.transform = `translateX(${translatePosition}px)`;

		return switchedTabs;
	};

	const onMouseDown = (event: MouseEvent) => {
		if (!tabs[(<HTMLElement>event.target).id]) {
			return;
		}

		onChange((<HTMLElement>event.target).id);

		if (!tabs[(<HTMLElement>event.target).id].sortable) {
			return;
		}

		Object.values(tabs).forEach(tab => {
			tab.selected = false;
		});

		tabs[(<HTMLElement>event.target).id].selected = true;

		const tab = tabs[(<HTMLElement>event.target).id];
		tab.isDrag = true;
		tab.element.setAttribute('data-drag', 'true');

		initialDragPosition = event.clientX;
		shadowTabs = { ...tabs };
	};

	const onMouseMove = (event: MouseEvent) => {
		if (!shadowTabs) {
			return;
		}

		const tab = Object.values(shadowTabs).find(tab => tab.isDrag);
		if (tab) {
			const position = event.clientX - initialDragPosition;
			const direction = getDirection(lastPosition, position);
			lastPosition = position;

			if (
				direction === 0 ||
				event.clientX <= minDragPosition ||
				event.clientX >= maxDragPosition
			) {
				return;
			}

			const sideTab = Object.values(sortTabs(shadowTabs)).find(
				side => side.order === tab.order + direction,
			);

			const switchLeft =
				direction == -1 && event.clientX < sideTab?.left + sideTab?.width;
			const switchRight = direction == 1 && event.clientX > sideTab?.left;

			if (sideTab?.sortable && (switchLeft || switchRight)) {
				shadowTabs = switchTab(tab, sideTab, direction);
			}

			tab.element.style.transform = `translateX(${position}px)`;
		}
	};

	const onDrop = () => {
		if (!shadowTabs) {
			return;
		}

		const tab = Object.values(shadowTabs).find(tab => tab.isDrag);
		if (!tab) {
			return;
		}

		document.querySelector('[role="tablist"]').setAttribute('data-drop', 'true');

		tab.element.removeAttribute('data-drag');
		initialDragPosition = 0;

		if (Object.values(shadowTabs).some(tab => tab.order !== tabs[tab.id].order)) {
			tabs = { ...shadowTabs };
			onSave && onSave(tabs);
		}

		tab.element.style.transform = `translateX(0px)`;
		shadowTabs = undefined;
	};

	const onMouseOut = (event: MouseEvent) => {
		if ((<HTMLElement>event.target).getAttribute('role') === 'tablist') {
			onDrop();
		}
	};

	afterUpdate(() => {
		document
			.querySelector('[role="tablist"]')
			.querySelectorAll('[role="tab"]')
			.forEach((tab: HTMLElement) => {
				tab.style.transform = 'translateX(0)';
				tabs[tab.id] = {
					...tabs[tab.id],
					left: tab.offsetLeft,
					isDrag: false,
				};
			});
		document.querySelector('[role="tablist"]').removeAttribute('data-drop');
	});

	onMount(() => {
		const tabElements = document
			.querySelector('[role="tablist"]')
			.querySelectorAll('[role="tab"]');

		tabElements.forEach((tab: HTMLElement) => {
			tabs[tab.id] = {
				...tabs[tab.id],
				id: tab.id,
				element: tab,
				left: tab.offsetLeft,
				width: tab.offsetWidth,
				isDrag: false,
			};

			if (!tabs[tab.id].sortable) {
				minDragPosition +=
					minDragPosition === 0 ? tab.offsetWidth + tab.offsetLeft : tab.offsetWidth;
			}
		});

		var lastTab = <HTMLElement>tabElements[tabElements.length - 1];
		maxDragPosition = lastTab.offsetLeft + lastTab.offsetWidth;
	});
</script>

<nav
	role="tablist"
	on:mousemove={onMouseMove}
	on:mouseout={onMouseOut}
	on:blur={onDrop}
>
	{#each Object.entries(sortTabs(tabs)) as [id, tab] (id)}
		<div
			role="tab"
			{id}
			class="tab"
			class:current={current === id || Object.keys(tabs).length === 1}
			on:mousedown={onMouseDown}
			on:mouseup={onDrop}
			disabled={tab.disabled}
		>
			{#if tab.icon}
				<svelte:component this={tab.icon} />
			{/if}
			{tab.label}
			{#if tab.counter}<small>({tab.counter})</small>{/if}
		</div>
	{/each}
	{#if onCreation}
		<button on:click={onCreation} title="Créer une nouvelle liste" class="add">
			<Icons.Plus />
		</button>
	{/if}
</nav>

<style>
	nav {
		display: flex;
		padding: 1rem 1rem 0;
	}

	nav:is([data-drop]) > .tab {
		transition: none;
	}

	.tab {
		display: flex;
		align-items: center;
		padding: 1rem;
		font-size: 1rem;
		line-height: 1;
		color: #fff;
		cursor: pointer;
		border: none;
		border-radius: 8px 8px 0 0;
		background-color: #3d3d3d;
		user-select: none;
	}

	.tab:not(:first-child) {
		margin-left: 4px;
	}

	.tab:not([data-drag]) {
		transition: transform 100ms ease;
	}

	.current {
		z-index: 10;
		background-color: #4e4e4e;
	}

	.add {
		position: relative;
		align-self: center;
		width: 2rem;
		height: 2rem;
		margin-left: 0.5rem;
		cursor: pointer;
		border-radius: 50%;
		border: none;
		background-color: #4e4e4e;
		transition: background-color linear 0.2s;
	}

	.add :global(svg) {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
	}

	.add:hover {
		background-color: #3d3d3d;
	}

	.tab :global(svg) {
		width: 1rem;
		height: auto;
		margin-right: 0.5rem;
	}

	small {
		margin-left: 0.2rem;
		color: var(--color);
	}
</style>
