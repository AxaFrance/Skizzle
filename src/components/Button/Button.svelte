<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  let className = '';
	export { className as class };
  export let danger:boolean = false;
  export let clear:boolean = false;
  export let disabled:boolean = false;
  export let light:boolean = false;
  export let type:string = '';

  const dispatch = createEventDispatcher();
  const onClick = (event) => {
    if(type !== "submit") {
      event.preventDefault();
    }
    dispatch('click');
  }
</script>


<button {type} class={className} class:danger class:clear class:light on:click={onClick} {disabled}>
  <slot/>
</button>

<style>
  button {
    display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		color: #fff;
		font-size: 1rem;
		border-radius: 4px;
		border: none;
		background-color: var(--color);
		transition: opacity linear 0.2s;
  }

  .danger {
    background-color: red;
  }

  .clear {
    background-color: #333;
  }

  .light {
    background-color: transparent;
  }
</style>