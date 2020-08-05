<script>
  
  const { shell, remote, ipcRenderer } = require('electron');
  import { SettingsRefresh, SettingsStartup, SettingsOrganizations, SettingsTheme, SettingsGlobals } from './SettingsOptions';
  import { removeItem } from '../../shared/storage';
  import { cleanStore, language } from '../../shared/store';
  import { clear } from '../../shared/requester.js';

  ipcRenderer.on('loggedOut', () => {
    removeItem('clientToken');
    cleanStore();
    clear();
  });

  const logout = () => {
    ipcRenderer.send('logout');
  }

  const components = [
    { state: 'globals', label: language.getWord('Globals'), className: 'skz-settings-button', component: SettingsGlobals, action: () => setSelected('globals')},
    { state: 'refresh', label: language.getWord('Refreshment'), className: 'skz-settings-button', component: SettingsRefresh, action: () => setSelected('refresh')},
    { state: 'startup', label: language.getWord('StartUp'), className: 'skz-settings-button', component: SettingsStartup, action: () => setSelected('startup')},
    { state: 'organizations', label: language.getWord('Organizations'), className: 'skz-settings-button', component: SettingsOrganizations, action: () => setSelected('organizations')},
    { state: 'theme', label: language.getWord('Theme'), className: 'skz-settings-button', component: SettingsTheme, action: () => setSelected('theme')},
    { label: `${language.getWord('Version')} ${remote.app.getVersion()}`, className: 'skz-settings-version', action: () => shell.openExternal('https://electronjs.org/')},
    { label: language.getWord('SignOut'), className: 'skz-settings-logout', action: logout}
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