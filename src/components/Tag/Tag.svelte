<script>
    import { createEventDispatcher } from 'svelte';
    export let tag;

    let dispatch = createEventDispatcher();
    let selected = false;

    const tagSelected = ({ target }) => {
        const checked = target.checked;
        
        dispatch('tag', {
            tag,
            checked
        });

        selected = checked;
    }
</script>

<style src="./Tag.scss"></style>

<li class="skz-tag {selected ? 'skz-tag--selected' : ''}">
    <label class="skz-tag__labels" for={tag}>
        {tag}
    </label>
    <input
        type="checkbox"
        id={tag}
        class="skz-tag__check"
        on:change={tagSelected}
        value={selected}
    />
</li>