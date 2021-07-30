<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
  import { getDateStr, getLabelsFrom, getPullRequestsFromCustomSettings } from 'shared/utils';
  import AccountTitle from "components/AccountTitle";
  import type { CustomListType, PullRequestType } from "models/skizzle";
  import { customLists, notifications, pullRequests, repositories, settings } from 'shared/stores/default.store';
  import Icons from 'components/icons';
  import TagInput from 'components/TagInput';
  import { client } from 'shared/stores/authentication.store';
  import { remote } from 'shared/remote';
	export let onDone: () => void;
  export let isInCreationMode: boolean = false;
  export let customList: CustomListType = {
    id: uuidv4(),
    name : '',
    tags: []
  } as CustomListType;
  const onImport = async () => {
		const result: any = await remote.invoke('file-import');
		if (result) {
			customList = { ...JSON.parse(result), id: uuidv4() } as CustomListType;
			notifications.update(notifications => [
				...notifications,
				{
					text: 'Liste importée.',
					id: uuidv4(),
				},
			]);
		}
	};
  const saveSettings = () => {
    updateSettings({
      ...customList,
      hiddenPullRequestsIds: pullRequestsList.reduce((acc, curr) => {
        if (!curr.show) {
          acc.push(curr.pullRequest.pullRequestId);
        }
        return acc;
      }, [] as string[])
    });
    notifications.update(notifications => [
      ...notifications,
      {
        text: `Liste ${isInCreationMode ? 'créée' : 'modifiée'}`,
        id: uuidv4(),
      },
    ]);
    onDone();
  }
  const updateSettings = (list: CustomListType) => {
    customLists.update(x => {
      const exist = ({ id }: CustomListType) => list.id === id;
      if (!x.some(exist)) {
        x = [...x, list];
      } else {
        x[x.indexOf(x.find(exist))] = list;
      }
      return x;
    })
  }
  const getTags = (event: CustomEvent<{ tags: string[] }>) => {
    customList.tags = event.detail.tags;
  }
  $: pullRequestsList = getPullRequestsFromCustomSettings($pullRequests, customList).map(x => ({
    pullRequest: x,
    show: !customList.hiddenPullRequestsIds || !customList.hiddenPullRequestsIds.some(y => y === x.pullRequestId)
  })) as { pullRequest: PullRequestType, show: boolean }[];
</script>

<div class="list">
  <div class="form">
    <div>
      <AccountTitle>
        <p class="title">
          {customList?.id ? 'Création d\'une nouvelle liste' : 'Modification de la liste'}
          <small>ID: {customList?.id}</small>
        </p>
        <input
          id="import"
          on:click={onImport}
          type="submit"
          value={'Charger une liste'}
        />
      </AccountTitle>
      <div class="fields">
        <div class="left">
          <label>
            <span>Nom :</span>
            <input type="text" bind:value={customList.name}/>
          </label>
          <TagInput 
            id="tags" 
            label="Afficher les pull request contenant les tags :" 
            suggestions={getLabelsFrom($pullRequests)}
            tags={customList.tags}
            on:tags={event => getTags(event)}
          />
          <label>
            <span>Afficher les pull requests de ce provider :</span>
            <select bind:value={customList.provider} id="providers">
              <option value="">-- Selectionner un service de provider --</option>
              {#each Object.keys($client) as key}
                <option value={key}>
                  {key}
                </option>
              {/each}
            </select>
          </label>
          <label>
            <span>Afficher les pull requests de ce repository :</span>
            <select bind:value={customList.repositoryId} id="repositories">
              <option value="">-- Selectionner un repository --</option>
              {#each $repositories as repository}
                <option value={repository.repositoryId}>
                  {repository.name}
                </option>
              {/each}
            </select>
          </label>
          <span>Masquer les pull requests :</span>
          <label>
            <input type="checkbox" bind:checked={customList.withoutOwnedByUserPR}/>
            <span>Que j’ai créé</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutOldPR}/>
            <span>Datant de plus de 30 jours</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutConflict}/>
            <span>En conflit</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutDraft}/>
            <span>En brouillon</span>
          </label>
          <label>
            <input type="checkbox" bind:checked={customList.withoutCheckedByOwner}/>
            <span>Sur lesquelle je suis déjà intervenu(e)</span>
          </label>
        </div>
        <div class="right">
          {#if pullRequestsList.length > 0}
            <span>Pull Requests masquées manuellement</span>
            <ul>
              {#each pullRequestsList as { pullRequest, show } (pullRequest.pullRequestId)}
                <li>
                  <button on:click={() => show = !show} title="{pullRequest.title} - {getDateStr(new Date(pullRequest.date))}">
                    {#if show}
                      <Icons.Visibility color={$settings.theme}/>
                    {:else}
                      <Icons.VisibilityOff color={$settings.theme}/>
                    {/if}
                    <span class={show ? '' : 'hidden'}> {pullRequest.title} <small>- {getDateStr(new Date(pullRequest.date))}</small></span>
                  </button>
                </li>
              {/each}
            </ul>
          {:else}
           <span>Il n'y a aucune pull request pour le moment.</span>
          {/if}
        </div>
      </div>
    </div>
    <div class="action">
      <button on:click={() => onDone()}>Annuler</button>
      <button type="submit" on:click={() => saveSettings()}>Enregistrer</button>
    </div>
  </div>
</div>

<style lang="scss">
  .title {
    display: flex;
    flex-direction: column;
  }
  .list {
    height: 100%;
    overflow: auto;
  }
  .list > .form {
    background-color: #6B6B6B;
    box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
    border-radius: 4px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }
  span {
    line-height: 1.5rem;
  }
  .form > div {
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }
  .fields {
    display: flex;
    .left {
      display: flex;
      padding-right: 1rem;
      flex-direction: column;
      width: 100%;
      flex: 1;
    }
    .right {
      width: 50%;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }
  .action {
    display: flex;
    justify-content: flex-end;
    background-color: #5C5C5C;
    padding: 1rem;
    flex-direction: row !important;
    flex: 0 1 auto;
  }
  .hidden {
    opacity: 0.5;
  }
  label {
    display: flex;
    padding-bottom: 1rem;
    flex-direction: column;
  }
  select {
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
    background: #848484;
    color: #fff;
	}
  button {
		cursor: pointer;
		border: none;
		background-color: transparent;
		transition: opacity linear 0.2s;
    color: #fff;
    margin-right: 0.5rem;
	}
	button:hover {
		opacity: 0.5;
	}
  ul {
    list-style: none;
    background-color: #848484;
    border-radius: 4px;
    padding: 1rem;
  }
  ul li {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  li > button {
    display: flex;
    align-items: center;
    > span {
      margin-left: 0.5rem;
    }
  }
  small {
    font-size: x-small;
    font-weight: normal;
    color: #ccc;
  }
  [type='text'] {
    background: #848484;
    border-radius: 4px;
    border: 0;
    padding: 0.5rem;
    color: #fff;
  }
  [type='submit'] {
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
	}
	[type='submit']:disabled {
		opacity: 0.5;
	}
</style>