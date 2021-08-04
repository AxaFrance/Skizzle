<script lang="ts">
	import Icons from 'components/icons';
    import { ProviderEnum } from "models/skizzle";
    import type { OAuthAzureDevOpsConfigType } from "providers";
    import { remote } from "shared/remote";
    import { client } from "shared/stores/authentication.store";
    import { repositories, settings } from "shared/stores/default.store";
    import { getDateStr } from 'shared/utils';
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let builds: any = undefined;

    //https://dev.azure.com/mathieudebaerdemaeker/fa084f6d-16db-4cd8-8b01-4479d3afdaef/_apis/build/definitions?repositoryId=563b5e0f-ee41-4b60-aa86-58c789417348&repositoryType=TfsGit&api-version=6.1-preview.6

    onMount(async () => {
        const config = get(client)[ProviderEnum.AzureDevOps] as OAuthAzureDevOpsConfigType;

        const definitions = (await Promise.all($repositories.map(async ({ repositoryId, projectId, organizationName }) => {
            return await remote.invoke(
                'request',
                JSON.stringify({
                    url: `https://dev.azure.com/${organizationName}/${projectId}/_apis/build/definitions?repositoryId=${repositoryId}&repositoryType=TfsGit&api-version=6.1-preview.6`,
                    options: {
                        'content-type': 'application/json',
                        authorization: config.access_token,
                    },
                    settings: get(settings),
                }),
            );
        }))).reduce((acc, curr) => acc.concat(curr.value), []);

        console.log({ definitions });

        builds = (await Promise.all(definitions.map(async ({ id, organizationName, projectId }) => {
            return await remote.invoke(
                'request',
                JSON.stringify({
                    url: `https://dev.azure.com/mathieudebaerdemaeker/fa084f6d-16db-4cd8-8b01-4479d3afdaef/_apis/build/latest/${id}?api-version=6.1-preview.1`,
                    options: {
                        'content-type': 'application/json',
                        authorization: config.access_token,
                    },
                    settings: get(settings),
                }),
            );
        })));

        console.log(builds);
    });

    const openLink = (url: string) => remote.openDefaultBrowser(url);
</script>

{#if builds}
    <ul class="list">
        {#each builds as build}
            <li>
                <div class="pr">
                    <button class="link" on:click={() => openLink(build._links.web.href)} />
                        <div class={`container pr__avatar`}>
                            <div class="avatar">
                                <svelte:component this={Icons.User} color={$settings.theme} />
                                <div class="badge">
                                    <svelte:component this={Icons[ProviderEnum.AzureDevOps]} />
                                </div>
                            </div>
                        </div>
                    <div class="details">
                        <header>
                            <h2 class="author">
                                {build.requestedBy.displayName} - {getDateStr(new Date(build.queueTime))}
                            </h2>
                        </header>
                        <h3 class="title">
                            {build.definition.name}
                        </h3>
                        <p class="repo">
                            {build.project.name} / {build.repository.name}
                        </p>
                    </div>
                    <footer>
                    </footer>
                </div>
            </li>
        {/each}
    </ul>
{:else}
    <p>Chargement...</p>
{/if}

<style>
    .list {
        padding: 1rem;
		list-style: none;
	}

	.list li:not(:last-child) {
		margin-bottom: 1rem;
	}

	.pr {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: 1rem;
		color: #fff;
		border-radius: 8px;
		background-color: #444;
		transition: opacity linear 0.2s;
	}

	.pr:hover {
		opacity: 0.8;
	}

	:global(.pr__avatar) {
		margin-right: 1rem;
	}

	.details {
		flex: 1 1 calc(100% - 5rem);
	}

	header {
		margin-bottom: 0.5rem;
		font-size: 0.8rem;
		color: #aaa;
	}

	.author {
		margin-right: auto;
		font-size: 0.8rem;
		line-height: 1;
	}

	.title {
		margin-bottom: 0.5rem;
		font-size: 1rem;
		line-height: 1.3;
		font-weight: normal;
		display: flex;
		align-items: center;
	}

	.repo {
		font-size: 0.8rem;
		color: #aaa;
		line-height: 1;
	}

	footer {
		display: flex;
		align-items: center;
		width: calc(100% + 2rem);
		margin: 1rem -1rem -1rem;
		padding: 0.5rem 1rem;
		border-radius: 0 0 8px 8px;
		background-color: #3e3e3e;
	}

	.more {
		position: relative;
		z-index: 1;
		display: block;
		width: 1.5rem;
		height: 1.5rem;
		margin-left: auto;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	.more:hover {
		background-color: #333;
	}

	.link {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		cursor: pointer;
		border: none;
		background-color: transparent;
	}

	.no-comment {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		text-align: center;
		transform: translateY(-50%);
	}

	.status {
		display: inline-block;
		margin-right: 0.5rem;
		padding: 0 0.2rem;
		font-size: 0.8rem;
		font-weight: normal;
		border-width: 1px;
		border-style: solid;
		border-radius: 4px;
		vertical-align: bottom;
		line-height: 1.5;
	}

	.status--draft {
		border-color: #43fff6;
		color: #43fff6;
	}
	.status--conflicts {
		border-color: #ff5b5b;
		color: #ff5b5b;
	}
	.status--auto-complete {
		border-color: #82ff82;
		color: #82ff82;
	}

    .container {
		position: relative;
		height: 4rem;
	}

	.avatar {
		width: 4rem;
		height: 4rem;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid #fff;
	}

	.badge {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 2px solid #fff;
		background-color: #333;
	}

	.badge :global(svg) {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 60%;
		height: auto;
		transform: translateY(-50%) translateX(-50%);
	}
</style>