<script>
    let header = null;
    let footer = null;

    $: className = (value, label) => value && value.children.length ? `skz-modal-${label}--show` : '';
</script>

<style src="./Modal.scss"></style>

<div class="skz-modal">
    <div class="skz-modal-container">
         <div class={`skz-modal-header ${className(header, 'header')}`} bind:this={header}>
            <slot name="header"></slot>
        </div>
        <div class="skz-modal-body">
            <slot></slot>
        </div>
        <div class={`skz-modal-footer ${className(footer, 'footer')}`} bind:this={footer}>
            <slot name="footer"></slot>
        </div>
    </div>
</div>