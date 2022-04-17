const remote = require('electron').remote;
console.log("Renderer is working!");

/*Disable zoom*/
const webFrame = require('electron').webFrame;
webFrame.setZoomLevel(1);
//webFrame.setVisualZoomLevelLimits(1, 2);
//webFrame.setLayoutZoomLevelLimits(1, 2);

const win = remote.getCurrentWindow(); 

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls();
    }
};

window.onbeforeunload = (event) => {
    win.removeAllListeners();
}

function handleWindowControls() {
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button')?.addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('max-button')?.addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('close-button')?.addEventListener("click", event => {
        win.close();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
            document.body.classList.add('maximized');
        } else {
            document.body.classList.remove('maximized');
        }
    }

}

