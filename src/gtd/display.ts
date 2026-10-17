import { isMediumDevice, isMobile, isSmallDevice } from "./browser.js"
import { getConfiguration, setConfiguration } from "./configuration.js"
import { setDomDataset } from "./dom.js"

export function checkDisplayType() {

	if (isMobile() || isSmallDevice() || isMediumDevice()) {
      setDomDataset(document.documentElement, {
        display: "mobile"
      })

      setConfiguration("display", "mobile")
      return
    }

    setDomDataset(document.documentElement, {
      display: "desktop"
    })

    setConfiguration("display", "desktop")
}

export default function isMobileDisplay() {
	  return "mobile" == getConfiguration("display")
}
