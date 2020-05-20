<script>
  import { startup } from '../../shared/store';
  import { addItem } from '../../shared/storage';
  const { ipcRenderer } = require('electron');

  export let init;
  export let title;

  const setStartup = ({ target: { checked } }) => {
    addItem('startup', checked);
    startup.set(checked);

    ipcRenderer.send('launch-startup', checked);
  };
</script>

<style src="./Settings.scss"></style>

<button class="skz-settings-back" on:click={init}>Retour</button>
<label>{title}</label>
<div class="skz-settings-switchs">
  <span>Lancer l'application au démarrage</span>
  <input id="skz-startup" class="skz-settings-switch" type="checkbox" on:change={setStartup} checked={$startup}/>
  <label for="skz-startup" class="skz-settings-switch-label"></label>
</div>
