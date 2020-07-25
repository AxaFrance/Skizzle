<script>
  const { translate } = require('./i18n.js');

  export let retry;
  export let label;
</script>

<style src="./ErrorMessage.scss"></style>

<div class="skz-error-message">
    <p>{label}</p>
    <button on:click={retry}>{translate('Retry')}</button>
</div>