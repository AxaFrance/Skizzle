<script>
    const { translate } = require('./i18n.js');
    export let binding;
    export let optionalValue = false;
    export let options = [];
    export let defaultMessage = translate('DefaultValue');
    
    let className = ''
    export { className as class }
</script>

<style src="./Select.scss"></style>

<div class="skz-select__container {className}">
    <select class="skz-select__input" bind:value={binding}>
        {#if optionalValue}
            <option value="" selected disabled hidden>{defaultMessage}</option>
        {/if}
        {#each options as option}
            {#if Number.isInteger(option)}
                <option value={option}>{option}</option>
            {:else if option.label && option.svg}
                <option value={option.label}>
                    {option.label.toUpperCase()}
                    <img src={option.svg} alt={option.label} width="32" height="32">
                </option>
            {:else}
                <option value={option.code}>{option.label}</option>
            {/if}
        {/each}
    </select>
    <span class="glyphicon glyphicon-menu-down"></span>
</div>
