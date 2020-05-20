<style src="./Modal.scss"></style>

<div class="skz-modal">
    <div class="skz-modal-container">
         <div class="skz-modal-header">
            <slot name="header"></slot>
        </div>
        <div class="skz-modal-body">
            <slot></slot>
        </div>
        <div class="skz-modal-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</div>