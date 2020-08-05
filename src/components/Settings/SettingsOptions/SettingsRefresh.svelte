<script>
  
  import { refreshDelay, language } from '../../../shared/store';
  import { addItem } from '../../../shared/storage';
  
  export let init;
  export let title;

  const setTimer = ({ target: { value } }) => {
    addItem('refreshDelay', Number(value));
    refreshDelay.set(Number(value));
  };
</script>

<style src="../Settings.scss"></style>

<button class="skz-settings-back" on:click={init}>{language.getWord('Back')}</button>
<h1 class="skz-settings-title">{title}</h1>
<input
  class="skz-refresh-delay"
  type="range"
  step="5"
  min="0"
  max="60"
  value={$refreshDelay}
  on:input={setTimer} />
<small>
  {$refreshDelay === 0 ? language.getWord('Manually') : language.getWord('EveryMinutes', $refreshDelay)}
</small>
