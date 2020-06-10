<script>
    const { getCurrentWindow } = require('electron').remote;

    export let isMaximized;
</script>

<style src="./MacosBar.scss"></style>

<div class="window-controls">
    <button on:click={() => getCurrentWindow().hide()} class="button close-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="#000"/></svg>
    </button>
    <button on:click={() => getCurrentWindow().minimize()} class="button min-button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H5v-2h14v2z" fill="#000"/></svg>
    </button>
    {#if !isMaximized} 
        <button on:click={() => getCurrentWindow().maximize()} class="button max-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.17 12L15 8.83l1.41-1.42L21 12l-4.59 4.58L15 15.17 18.17 12M5.83 12L9 15.17l-1.41 1.42L3 12l4.59-4.58L9 8.83 5.83 12z" fill="#000"/></svg>
        </button>
    {:else}
        <button on:click={() => getCurrentWindow().unmaximize()} class="button restore-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.41 7.41L10 12l-4.59 4.59L4 15.17 7.17 12 4 8.83l1.41-1.42m13.18 9.18L14 12l4.59-4.58L20 8.83 16.83 12 20 15.17l-1.41 1.42z" fill="#000"/></svg>
        </button>
    {/if}
</div>