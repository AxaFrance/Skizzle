<script lang="ts">
	import AccountTitle from 'components/AccountTitle';
	import { ProviderEnum } from 'models/skizzle/ProviderEnum';
	import { clientAuthenticated } from 'shared/stores/authentication.store';
	import Icons from 'components/icons';
	import Tabs from 'components/Tabs';
	import { needIntro } from 'shared/stores/default.store';
	import ProviderAccount from 'components/ProviderAccount';
	import { onMount } from 'svelte';

	let step = 0;

	let currentProvider = ProviderEnum.AzureDevOps;

	$: tabs = {
		[ProviderEnum.AzureDevOps]: {
			label: 'Azure DevOps',
			icon: Icons.AzureDevOps,
			order: 0,
			disabled: !$clientAuthenticated.isAzureDevOpsAuthenticated
		},
		[ProviderEnum.Github]: {
			label: 'Github',
			icon: Icons.Github,
			order: 1,
			disabled: !$clientAuthenticated.isGithubAuthenticated
		}
	};

	const next = () => (step += 1);
	const previous = () => (step -= 1);

	onMount(() => {
		localStorage.clear();
	});
</script>

<main>
	<div class={`step ${step === 0 ? 'current' : ''}`}>
		<AccountTitle>Welcome to Skizzle. 👋</AccountTitle>
		<p>
			Skizzle is a pull request manager that allows you see all your teams work quickly in a
			single view. It works with your Azure DevOps and Github accounts.
		</p>
		<p>Let's take a few steps to set your Skizzle up. Are you ready?</p>
		<div class="actions">
			<button class="next" on:click={next}>
				Let's go! <Icons.ArrowRight />
			</button>
		</div>
	</div>
	<div class={`step ${step === 1 ? 'current' : ''}`}>
		<AccountTitle>Connect Skizzle to your providers</AccountTitle>
		<p>
			Skizzle supports Github and Azure DevOps, in order to use the app, you have to set at
			least one account. Choose a provider and let yourself guided.
		</p>
		<ul class="block">
			<li class={$clientAuthenticated.isAzureDevOpsAuthenticated ? 'valid' : ''}>
				<ProviderAccount provider={ProviderEnum.AzureDevOps} light />
			</li>
			<li class={$clientAuthenticated.isGithubAuthenticated ? 'valid' : ''}>
				<ProviderAccount provider={ProviderEnum.Github} light />
			</li>
		</ul>
		<div class="actions">
			<button class="previous" on:click={previous}>
				<Icons.ArrowLeft /> Previous
			</button>
			<button
				disabled={!$clientAuthenticated.isAzureDevOpsAuthenticated &&
					!$clientAuthenticated.isGithubAuthenticated}
				class="next"
				on:click={next}
			>
				Next <Icons.ArrowRight />
			</button>
		</div>
	</div>
	<div class={`step ${step === 2 ? 'current' : ''}`}>
		<AccountTitle>Follow repositories</AccountTitle>
		<p>
			Follow the repositories you interested in, and then Skizzle will show you their pull
			requests in your lists.
		</p>
		<div class="block">
			<Tabs
				current={currentProvider}
				on:change={({ detail: { tab } }) => (currentProvider = tab)}
				data={tabs}
			/>
			<div class="repos">
				<ProviderAccount provider={currentProvider} follow />
			</div>
		</div>
		<div class="actions">
			<button class="previous" on:click={previous}>
				<Icons.ArrowLeft /> Previous
			</button>
			<button class="next" on:click={next}>Next <Icons.ArrowRight /></button>
		</div>
	</div>
	<div class={`step ${step === 3 ? 'current' : ''}`}>
		<AccountTitle>You are now ready to use Skizzle 🎉</AccountTitle>
		<p>You can now easily follow your projects and create custom lists. Enjoy!</p>
		<div class="actions">
			<button class="previous" on:click={previous}>
				<Icons.ArrowLeft /> Previous
			</button>
			<button class="next" on:click={() => needIntro.set(false)}>
				Use Skizzle <Icons.ArrowRight />
			</button>
		</div>
	</div>
</main>

<style>
	main {
		position: relative;
		width: 100%;
		background: radial-gradient(circle at 35% 88.98%, var(--color), transparent 61%),
			radial-gradient(circle at 6.01% 9.99%, #0c5064, transparent 35%),
			radial-gradient(circle at 86.01% 70.96%, #262629, transparent 58%),
			radial-gradient(circle at 50% 50%, #333, #333 100%);
	}

	.step {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 100%;
		max-width: 30rem;
		transform: translateX(-50%) translateY(-50%);
		opacity: 0;
		pointer-events: none;
		transition: opacity linear 0.2s;
	}

	.current {
		opacity: 1;
		pointer-events: all;
	}

	p {
		margin-bottom: 1rem;
	}

	.actions {
		margin-top: 2rem;
		padding-top: 1rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid rgba(255, 255, 255, 0.2);
	}

	.previous {
		border: none;
		background: none;
	}

	.next {
		display: flex;
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1.2rem;
		cursor: pointer;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}

	.previous,
	.next {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		cursor: pointer;
	}

	.previous :global(svg) {
		margin-right: 0.5rem;
	}

	.next :global(svg) {
		margin-left: 0.5rem;
	}

	.next:not(:disabled):hover {
		opacity: 0.8;
	}

	.next {
		margin-left: auto;
	}

	.block {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 16px;
		background-color: rgba(0, 0, 0, 0.2);
	}

	.block :global(nav) {
		padding-top: 0;
	}

	.repos {
		height: 50vh;
		overflow: auto;
		padding: 1rem;
		border-radius: 8px;
		background-color: #4e4e4e;
	}

	ul {
		list-style: none;
	}

	li {
		display: flex;
		align-items: center;
		height: 5rem;
	}

	li > :global(*) {
		flex: 1 0 100%;
	}

	li:not(:last-child) {
		margin-bottom: 0.5rem;
	}
</style>
