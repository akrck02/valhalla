import Initializer from "./core/initializer.js";
import App from "./app.js";


/**
 * When the dynamic URL changes loads
 * the correspoding view from the URL
 */
window.addEventListener("hashchange", async () => {
    await App.instance().load();
});

/**
 * When the window is loaded load
 * the app state to show
 */
window.onload = async () => {
    await App.instance().load();
};
