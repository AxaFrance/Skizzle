<script>
  const { ipcRenderer } = require('electron');
  const { translate } = require('./i18n.js');
</script>

<style src="./Login.scss"></style>

<div class="skz-login">
  <img
    class="skz-login__logo"
    src="./assets/logo-skizzle.svg"
    alt="Skizzle"
  />
  <img
    class="skz-login__logo skz-login__logo--dark"
    src="./assets/logo-skizzle-dark-context.svg"
    alt="Skizzle"
  />
  <p class="skz-login__intro">
    {@html translate('Login')}
  </p>
  <button class="skz-login__button skz-login__button--azure" on:click={() => ipcRenderer.send('azure-devops-oauth')}>Azure DevOps</button>
</div>
