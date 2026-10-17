const SMALL_DEVICE_WIDTH = 760
const MEDIUM_DEVICE_WIDTH = 1024

/**
* Get if the device is a small device
* @returns True if the device is a small device
*/ 
export function isSmallDevice(): boolean {
   return window.matchMedia(`only screen and (max-width: ${SMALL_DEVICE_WIDTH}px)`).matches;
}

/**
* Get if the device is a medium device
* @returns True if the device is a medium device
*/
export function isMediumDevice(): boolean {
  return window.matchMedia(
      `only screen and (min-width: ${SMALL_DEVICE_WIDTH}px) and (max-width: ${MEDIUM_DEVICE_WIDTH}px)`,
  ).matches;
}

/**
 * Get if the device is a large device
 * @returns True if the device is a large device
 */
export function isLargeDevice(): boolean {
  return window.matchMedia(
    `only screen and (min-width: ${MEDIUM_DEVICE_WIDTH + 1}px)`,
  ).matches;
}

/**
 * Get if the device is a dark mode
 * @returns True if the device is a dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Returns true if the device is a light mode
 * @returns True if the device is a light mode
 */
export function prefersLightMode(): boolean {
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

/**
* Get if device prefers reduced motion
* @returns True if the device prefers reduced motion
*/
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
* Get if the device prefers reduced data
* @param query The query to check
* @returns True if the device prefers reduced data
*/
export function mediaQuery(query: string): boolean {
  return window.matchMedia(query).matches;
}

/**
* Get if matches one of the mobile media queries
* @returns True if the device is a mobile device
*/
export function isMobile() {
  return (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
    navigator.userAgent.match(/Opera Mini/i) ||
    navigator.userAgent.match(/IEMobile/i)
  );
}

/**
* Get the OS of the device
* @returns The OS of the device as a string
*/
export function getOs() {
  if (navigator.userAgent.indexOf("Win") != -1) return "Windows";
  if (navigator.userAgent.indexOf("Mac") != -1) return "MacOS";
  if (navigator.userAgent.indexOf("Linux") != -1) return "Linux";
  if (navigator.userAgent.indexOf("X11") != -1) return "UNIX";
}

