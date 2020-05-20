const remote = require('electron').remote;

(function handleWindowControls() {
  document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
      init();
    }
  };

  function init() {
    let window = remote.getCurrentWindow();
    const minButton = document.getElementById('minimize'),
      maxButton = document.getElementById('maximize'),
      restoreButton = document.getElementById('restore'),
      closeButton = document.getElementById('close');

    minButton.addEventListener('click', event => {
      window = remote.getCurrentWindow();
      window.minimize();
    });

    maxButton.addEventListener('click', event => {
      window = remote.getCurrentWindow();
      window.maximize();
      toggleMaxRestoreButtons();
    });

    restoreButton.addEventListener('click', event => {
      window = remote.getCurrentWindow();
      window.unmaximize();
      toggleMaxRestoreButtons();
    });

    toggleMaxRestoreButtons();
    window.on('maximize', toggleMaxRestoreButtons);
    window.on('unmaximize', toggleMaxRestoreButtons);

    closeButton.addEventListener('click', event => {
      window = remote.getCurrentWindow();
      window.hide();
    });

    function toggleMaxRestoreButtons() {
      window = remote.getCurrentWindow();
      if (window.isMaximized()) {
        maxButton.style.display = 'none';
        restoreButton.style.display = 'flex';
      } else {
        restoreButton.style.display = 'none';
        maxButton.style.display = 'flex';
      }
    }
  }
})();
