<script>
  import { onMount } from 'svelte';
  import Repositories from "../Repositories";
  export let project;
  export let checked = false;

  $: isOpen = checked;
  $: hasSelectedRepos = !!project.repositories.find(({ checked }) => checked);
</script>

<style src="./Project.scss"></style>

<li class={`skz-project ${hasSelectedRepos ? 'skz-project--selected' : ''}`}>
  <input
    type="checkbox"
    id={project.id}
    class="skz-project__check"
    on:change={() => isOpen = !isOpen}
    value={isOpen}
  />
  <label class="skz-project__name" for={project.id}>
    {project.name}
  </label>
  {#if isOpen}
  <Repositories repositories={project.repositories} />
  {/if}
</li>