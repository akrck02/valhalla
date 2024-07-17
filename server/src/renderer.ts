
    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button')?.addEventListener("click", event => {
        (window as any).electronAPI.minimize();
    });

    document.getElementById('max-button')?.addEventListener("click", event => {
        (window as any).electronAPI.maximize();
    });

    document.getElementById('close-button')?.addEventListener("click", event => {
        (window as any).electronAPI.close();
    });

