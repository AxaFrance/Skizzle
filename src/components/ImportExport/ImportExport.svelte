<script lang="ts">
  import { isFetchingData, repositories, organizations, projects } from 'shared/stores/default.store';
	import { HighlightSvelte } from "svelte-highlight";
	import { a11yDark } from "svelte-highlight/styles";
  import { json } from "svelte-highlight/languages";
	import Tabs from 'components/Tabs';
  import AccountTitle from 'components/AccountTitle';
  import { copyToClipboard, isJson } from 'shared/utils';
  import Icons from 'components/icons';
  import type { RepositoryType } from 'models/skizzle';
  import { ProviderEnum } from 'models/skizzle';

  export let followedRepositories: RepositoryType[];
  export let provider: ProviderEnum;
  export let shareDisplayed: boolean;

  let currentTab: string = 'import';
	let code: string = '';

  const changeTab = (tab:string) => currentTab = tab;

  const importCode = () => {
    let repositoriesImported = JSON.parse(code) as RepositoryType[];
    repositoriesImported = repositoriesImported
      .map(x => ({ ...x, checked: true }))
      .filter((repository) => {
        let result = repository.repositoryId && 
          repository.gitUrl && 
          repository.name &&
          !!repository.provider;

        if (provider === ProviderEnum.AzureDevOps) {
          result = result && repository.organizationName && 
            repository.projectId && 
            repository.projectName && 
            $projects.some(project => project.projectId === repository.projectId) &&
            $organizations.some(organization => organization.organizationName === repository.organizationName);
        }

        if (provider === ProviderEnum.Github) {
          result = result && repository.fullName && !!repository.owner
        }

        return result;
      });

		repositories.update(x => {
      const values = x.map(repository => ({
        ...repository,
        checked: repository.checked || repositoriesImported.some(z => z.repositoryId === repository.repositoryId)
      }));

      return ([...values, ...repositoriesImported.filter(y => !x.some(z => z.repositoryId === y.repositoryId))])
    });
    shareDisplayed = false;
	}

  const getExportCode = (): RepositoryType[] => {
    return followedRepositories.map(repository => ({
      ...repository,
      checked: undefined
    }));
  }
</script>

<svelte:head>
  {@html a11yDark}
</svelte:head>
  <AccountTitle>Importer / Exporter une liste de repositories.</AccountTitle>
  <p class="intro">Skizzle permet d'importer et d'exporter une liste de repositories suivis. Vous pouvez partager votre liste avec les autres membres de votre équipe.</p>
  <Tabs
    onChange={changeTab}
    current={currentTab}
    data={{ import: { order: 0, label: 'Importer' }, export : { order: 1, label: 'Exporter' }}}
  />
  <div class="container">
    {#if currentTab === 'export'}
    <p class="intro">Copiez le code JSON et importez-le dans une autre instance de Skizzle.</p>
    <div class="code">

      <HighlightSvelte language={json} code={JSON.stringify(getExportCode(), undefined, 2)} />
      <button
      class="copy"
          on:click={() => copyToClipboard(JSON.stringify(getExportCode(), undefined, 2), 'Code copié dans le presse-papier.')}
          disabled={$isFetchingData}
          title="Copier l'url de ce repository"
        >
        <Icons.Copy />
      </button>
    </div>
    {:else}
      <form on:submit|preventDefault={importCode}>
        <p class="intro">Collez le code JSON provenant d'une autre instance de Skizzle. <b>Attention</b> Skizzle remplacera les repositories que vous suivez actuellement.</p>
        <textarea bind:value={code} placeholder="Collez ici votre code JSON"></textarea>
        <div class="bar">
          <input disabled={!isJson(code)} type="submit" class="import-button" value="Importer les repositories" />
        </div>
      </form>
    {/if}
  </div>

  <style>
    textarea {
      margin-bottom: 0.5rem;
      color: #fff;
      width: 100%;
      height: 10rem;
      resize: vertical;
      padding: 1rem;
      border: none;
      border-radius: 4px;
      background-color: #2b2b2b;
    }
  
    .import-button {
      padding: 0.5rem 1rem;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 4px;
      border: none;
      background-color: var(--color);
      transition: opacity linear 0.2s;
    }
  
    .import-button:disabled {
      opacity: 0.5;
    }
  
    .import-button:not(:disabled):hover {
      opacity: 0.8;
    }
  
    .intro {
      margin-bottom: 1rem;
      font-size: 0.8rem;
      color: #ddd;
    }
  
    b {
      color: var(--color);
    }
  
    button {
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      border: none;
      background-color: transparent;
      transition: opacity linear 0.2s;
    }
  
    button:hover {
      opacity: 0.5;
    }
  
    button:last-child {
      margin-left: 1rem;
    }
  
    .container {
      margin-left: -2rem;
      margin-right: -2rem;
      margin-bottom: -2rem;
      padding: 1rem;
      border-radius: 0 0 8px 8px;
      background-color: #4e4e4e;
    }
  
    .code {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
    }
  
    .copy {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
  
    :global(.modale) :global(h1) {
      margin-bottom: 1rem;
    }
  
    :global(.modale) :global(.content) {
      display: flex;
      flex-direction: column;
    }
  
    .bar {
      display: flex;
      justify-content: flex-end;
    }
  </style>