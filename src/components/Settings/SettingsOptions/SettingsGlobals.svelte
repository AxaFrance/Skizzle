<script>
  const { translate } = require('./i18n.js');
  const path = require('path');
  const fs = require('fs');
  import { onMount } from 'svelte';
  import { language } from '../../../shared/store';
  import Select from '../../Select';

  export let init;
  export let title;

  let langs = [];

  onMount(() => {
    const files = fs.readdirSync(path.join(__dirname, 'assets/langs'));
    let svgs = [];

    for(let i = 0; i < files.length; i++) {
      const filename = path.join(__dirname, 'assets/langs', files[i]);
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
        svgs = fs.readdirSync(filename).map(x => ({
          svg: path.join(__dirname, 'assets/langs', files[i], x),
          label: x.replace(/\.[^/.]+$/, "")
        }));
      }
    }

    files.filter(file => file.indexOf('.json') >= 0).map(file => {
      const filename = file.slice(0, file.indexOf('.json'));
      let svg = (svgs.find(svg => svg.label === filename) || svgs[0]);

      langs = langs.concat([svg]);
    });
  });
</script>

<style src="../Settings.scss"></style>

<button class="skz-settings-back" on:click={init}>{translate('Back')}</button>
<h1 class="skz-settings-title">{title}</h1>
{#if langs}
  <p>{translate('ChooseLanguage')}</p>
  <Select 
    bind:binding={$language}
    optionalValue={true}
    options={langs}
    defaultMessage={translate('ChooseLanguage')}
  />
{/if}

