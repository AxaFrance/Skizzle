<script>
const { ipcRenderer } = require('electron');
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
    Skizzle vous permet de regrouper les pull requests de vos équipes. <br/>Pour commencer <b>connectez vous</b> avec votre compte.
  </p>
  <button class="skz-login__button skz-login__button--azure" on:click={() => ipcRenderer.send('azure-devops-oauth')}>Azure DevOps</button>
</div>
