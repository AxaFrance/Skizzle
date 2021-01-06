<script lang="ts">
  import AccountTitle from "../AccountTitle";
  import { ThemeEnum } from "models/skizzle/ThemeEnum";
  import { settings } from "shared/stores/default.store";
</script>

<h1>Réglages.</h1>

<p>Délai de rafraichissement : {$settings.refresh_delay} minute(s)</p>
<p>Configuration du proxy : {$settings.proxy}</p>
<p>Lancement au démarrage : {$settings.launch_at_startup}</p>
<p>Langage: {$settings.language}</p>


<p>Thème : </p>
<select bind:value={$settings.theme}>
  {#each Object.entries(ThemeEnum) as [key, value]}
    <option value={value}>
      {key}
    </option>
  {/each}
</select>

<br />
<AccountTitle>
  Ceci est un test
</AccountTitle>