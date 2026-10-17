import { viewHandler } from "./view.js";

const paths: Map<string, viewHandler> = new Map();
let homeHandler: viewHandler = async (_p, c) => {
	c.innerHTML = "Home page.";
};
let notFoundHandler: viewHandler = async (_p, c) => {
	c.innerHTML = "Page not found.";
};

/**
 * Register a new route.
 * @param path The router path
 * @param handler The route handler
 */
export function setRoute(path: string, handler: viewHandler) {
	// If the path is empry return
	if (undefined == path) return;

	// If the path is blank or /, register home and return
	path = path.trim();

	// If the path is home
	if ("/" == path || "" == path) {
		homeHandler = handler;
		return;
	}

	// If the path ends with / trim it
	const indexOfSlash = path.indexOf("/");
	if (-1 != indexOfSlash && "/" == path.substring(path.length - 1))
		path = path.substring(0, path.length - 1);

	// Replace all the variables with regex expressions to capture them later
	const regexp: RegExp = /\/(\$+)/g;
	path = path.replaceAll(regexp, "/([^\/]+)");
	paths.set(path, handler);
}

/**
 * Register the route to display when route path is not found.
 * @param handler The view handler to call
 */
export function setNotFoundRoute(handler: viewHandler) {
	notFoundHandler = handler;
}

/**
 * Register the route to displayon home.
 * @param handler The view handler to call
 */
export function setHomeRoute(handler: viewHandler) {
	homeHandler = handler;
}

/**
 * Show view for the given route.
 * @param path The given path to search for
 * @param container The container to display the views in
 * @param override If the content overrides previous content
 */
export function showRoute(path: string, container: HTMLElement, override : boolean = true) {
	if(override) container.innerHTML = "";

	// If it is the home route, show
	if ("/" == path || "" == path) {
		homeHandler([], container);
		return;
	}

	// Else search matching route
	const keys = Array.from(paths.keys()).sort(compareRouteLength);
	for (const route of keys) {
		// Check if route matches
		const regexp = RegExp(route);
		const params = path.match(regexp);

		if (null != params && 0 != params.length) {
			paths.get(route)(params.slice(1), container);
			return;
		}
	}

	// If no route found, show not found view.
	notFoundHandler([], container);
}

/**
 * Compare the length of two routes
 */
function compareRouteLength(a: string, b: string): number {
	const aLength = a.split("/").length - 1;
	const bLength = b.split("/").length - 1;

	if (aLength == bLength) return 0;

	if (aLength < bLength) return 1;

	return -1;
}
