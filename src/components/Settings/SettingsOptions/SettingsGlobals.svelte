<script>
  const fs = require('fs');
  import { onMount } from 'svelte';
  import { language } from '../../../shared/store';
  import Select from '../../Select';

  export let init;
  export let title;

  let langs = [];

  onMount(() => {
    const files = fs.readdirSync(`${__dirname}/assets/langs/`);
    let svgs = [];

    for(let i = 0; i < files.length; i++) {
      const filename = `${__dirname}/assets/langs/${files[i]}`;
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()){
        svgs = fs.readdirSync(filename).map(x => ({
          svg: `${__dirname}/assets/langs/${files[i]}/${x}`,
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

<button class="skz-settings-back" on:click={init}>{language.getWord('Back')}</button>
<h1 class="skz-settings-title">{title}</h1>
{#if langs}
  <p>{language.getWord('ChooseLanguage')}</p>
  <Select 
    bind:binding={$language.lang}
    optionalValue={true}
    options={langs}
    defaultMessage={language.getWord('ChooseLanguage')}
  />
{/if}

