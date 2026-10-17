/**
 * The id of the configuration used in the LocalStorage API
 * NOTE: Change this value with your app name.
 */
const configurationId: string = "gtd";

/**
 * Load a JSON file as the configuration of the app
 * @param path The file path
 */
export async function loadConfiguration(path: string) {
	const loadedConfiguration = await fetch(path).then((res) => res.json());

	if (null != localStorage[configurationId]) {
		for (const key in loadedConfiguration) {
			setConfiguration(key, loadedConfiguration[key]);
		}
	} else {
		localStorage[configurationId] = JSON.stringify(loadedConfiguration);
	}
}

/**
 * Set a configuration parameter
 * @param id The configuration parameter id
 * @param value The value to set
 */
export function setConfiguration(id: string, value: any) {
	const configuration = JSON.parse(localStorage[configurationId] || "{}");
	configuration[id] = value;
	localStorage.setItem(configurationId, JSON.stringify(configuration));
}

/**
 * Get configuration value
 * @param id The parameter id
 * @returns The parameter value
 */
export function getConfiguration(id: string) {
	return JSON.parse(localStorage[configurationId] || "{}")[id];
}

/**
 * Get if a configuration is already set
 * @param id The id of the configuration
 * @returns If the configuration is already set
 */
export function isConfigurationSet(id: string) {
	return undefined !== getConfiguration(id);
}

/**
* Get if a configuration is active
* @param id The id of the configuration
* @returns If the configuration is active
*/
export function isConfigurationActive(id: string) {
	return true == getConfiguration(id);
}
