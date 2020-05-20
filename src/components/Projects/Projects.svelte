<script>
  import { createEventDispatcher } from 'svelte';
  import Project from '../Project';
  export let projects;

  const titles = ['Aucun projet', '1 Projet'];
  let searchInput = '';
  let searchableProject = [];

  $: searchableProject = projects.filter(p => p.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 || p.repositories.filter(r => r.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1).length > 0);
  $: checked = searchableProject.length > 0 && searchableProject.length <= 5;
  $: title = titles[searchableProject.length] || `${searchableProject.length} Projets`;

  const dispatch = createEventDispatcher();
  let map = {}

  const handleKeydown = e => {
    let keydown = e.type === 'keydown';
    map[e.keyCode] = keydown;
    
    if (map['70'] && map['17']) {
      dispatch('focus', 'search');
    }
  }

  const canCheckedProject = project => project.repositories.length <= 10 || project.repositories.find(r => r.name.toLowerCase() === searchInput.toLowerCase())
</script>

<style src="./Projects.scss"></style>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeydown}/>

<div class="skz-projects">
  <header class="skz-projects__header">
    <div class="skz-projects__search">
      <input id="search" type="text" bind:value={searchInput} placeholder="Chercher"/>
    </div>
    <h2>{title}</h2>
  </header>
  <div class="skz-projects__list-container">
    <ul class="skz-projects__list">
      {#each searchableProject as project}
        <Project project={project} checked={checked && canCheckedProject(project)}/>
      {:else}
        <li>
          <p class="skz-projects__empty">
            Les organisations actuellement selectionnées ne contiennent aucun projet.
          </p>
        </li>
      {/each}
    </ul>
  </div>
</div>
