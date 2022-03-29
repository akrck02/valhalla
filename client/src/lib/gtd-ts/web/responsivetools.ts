/**
 * Get if is small device (less than 768px)
 * @description This method is useful for checking if the device is a small device.
 * @returns true if the device is a small device, false otherwise
 * @example
 *     const isSmallDevice = isSmallDevice();
 *     console.log(isSmallDevice); // true
 */
export function isSmallDevice(): boolean {
    return window.matchMedia("only screen and (max-width: 760px)").matches;
}

/**
 * Get if is medium device (between 768px and 1024px)
 * @description This method is useful for checking if the device is a medium device.
 * @returns true if the device is a medium device, false otherwise
 * @example
 *    const isMediumDevice = isMediumDevice();
 *    console.log(isMediumDevice); // true
 */
export function isMediumDevice(): boolean {
    return window.matchMedia(
        "only screen and (min-width: 760px) and (max-width: 1024px)"
    ).matches;
}

/**
 * Get if is large device (more than 1024px)
 * @description This method is useful for checking if the device is a large device.
 * @returns true if the device is a large device, false otherwise
 * @example
 *      const isLargeDevice = isLargeDevice();
 *      console.log(isLargeDevice); // true
 */
export function isLargeDevice(): boolean {
    return window.matchMedia("only screen and (min-width: 1025px)").matches;
}

/**
 * Get if user prefers dark mode
 * @description This method is useful for checking if the user prefers dark mode.
 * @returns true if the user prefers dark mode, false otherwise
 * @example
 *     const prefersDarkMode = prefersDarkMode();
 *     console.log(prefersDarkMode); // true
 */
export function prefersDarkMode(): boolean {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Get if user prefers light mode
 * @description This method is useful for checking if the user prefers light mode.
 * @returns true if the user prefers light mode, false otherwise
 * @example
 *    const prefersLightMode = prefersLightMode();
 *    console.log(prefersLightMode); // true 
 */
export function prefersLightMode(): boolean {
    return window.matchMedia("(prefers-color-scheme: light)").matches;
}

/**
 * Get if user prefers reduced-motion mode
 * @description This method is useful for checking if the user prefers reduced-motion mode.
 * @returns true if the user prefers reduced-motion mode, false otherwise
 * @example
 *      const prefersReducedMotion = prefersReducedMotion();
 *      console.log(prefersReducedMotion); // true
 */
export function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Return if media query matches 
 * @param query Media query to match
 * @returns true if media query matches, false otherwise
 */
export function mediaQuery(query: string): boolean {
    return window.matchMedia(query).matches;
}

/**
 * Get if is mobile device
 * @description This method is useful for checking if the device is a mobile device.
 * @returns true if the device is a mobile device, false otherwise
 * @example
 *     const isMobileDevice = isMobileDevice();
 *     console.log(isMobileDevice); // true
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


export function getOs() {
    if (navigator.userAgent.indexOf("Win") != -1) return "Windows";
    if (navigator.userAgent.indexOf("Mac") != -1) return "MacOS";
    if (navigator.userAgent.indexOf("Linux") != -1) return "Linux";
    if (navigator.userAgent.indexOf("X11") != -1) return "UNIX";
   
}