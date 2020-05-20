<script>
  const { shell, remote, ipcRenderer } = require('electron');
  import SettingsRefresh from './SettingsRefresh.svelte';
  import SettingsStartup from './SettingsStartup.svelte';
  import SettingsOrganizations from './SettingsOrganizations.svelte';
  import SettingsTheme from './SettingsTheme.svelte';
  import { removeItem } from '../../shared/storage';
  import { cleanStore } from '../../shared/store';
  import { clear } from '../../shared/requester.js';

  const logout = () => {
    ipcRenderer.send('logout');
    removeItem('clientToken');
    cleanStore();
    clear();
  }

  const components = [
    { state: 'refresh', label: 'Rafraîchissement', className: 'skz-settings-button', component: SettingsRefresh, action: () => setSelected('refresh')},
    { state: 'startup', label: 'Démarrage', className: 'skz-settings-button', component: SettingsStartup, action: () => setSelected('startup')},
    { state: 'organizations', label: 'Organisations', className: 'skz-settings-button', component: SettingsOrganizations, action: () => setSelected('organizations')},
    { state: 'theme', label: 'Theme', className: 'skz-settings-button', component: SettingsTheme, action: () => setSelected('theme')},
    { label: `Version ${remote.app.getVersion()}`, className: 'skz-settings-version', action: () => shell.openExternal('https://electronjs.org/')},
    { label: 'Se déconnecter', className: 'skz-settings-logout', action: logout}
  ];

  let selected = {
    state : ''
  };

  const setSelected = state => {
    selected = components.find(x => x.state === state);
  }
</script>

<style src="./Settings.scss"></style>

<div class="skz-settings">
  <div class="skz-settings-field">
    {#each components as component}
      <button class={component.className} on:click={component.action}>{component.label}</button>
    {/each}
  </div>
  <div class="skz-settings-field slidable {selected.state ? '':'slidable--open'}">
      <svelte:component this={selected.component} title={selected.label} init={() => selected = {
        ...selected,
         state: ''
      }} />
  </div>
</div>