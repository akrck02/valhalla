/**
 * This interface represents a lenguage
 * @author akrck02
 */
export interface ILanguage {
  name: string
  main: string
  locales: string[]
}

/**
 * Languages that can be used in the application
 * @author akrck02
 * 
 * INFO: Add languages here as needed 
 */
export const Languages = {
  Spanish: { name: "spanish", main: "es", locales: ["es", "es-ES"] },
  English: { name: "english", main: "en", locales: ["en", "en-US", "en-GB"] },
  Galician: { name: "galician", main : "gl", locales: ["gl", "gl-ES"] },
  Catala: { name: "catala", main:"ca", locales: ["ca","ca-ES"] }
}

/** This language will be used if no other language is set */
const DEFAULT_LANGUAGE : ILanguage = Languages.English

/** Set here the available languages for the app **/
const AVAILABLE_LANGUAGES = [
  Languages.Spanish,
  Languages.English,
  Languages.Galician,
  Languages.Catala
]

/** This is the path of the i18n file structure **/
const I18N_PATH = "./resources/i18n" 

/** This is the buffer **/ 
const buffer : Map<string, Object> = new Map()

/** Current language for the web app **/
let currentLanguage : ILanguage = Languages.English

/**
 * Set current language by locale
 * @param locale The locale to get the language for 
 * @param reloadBundles (Optional) Reload the existing bundles for current language
 * @author akrck02
 */
export async function setCurrentLanguage(locale : string, reloadBundles = false) {
  
  // Set language
  if (undefined === locale) {
    currentLanguage = DEFAULT_LANGUAGE     
  } else {
    currentLanguage = AVAILABLE_LANGUAGES.find((lang) => lang.locales.includes(locale)) 

    if(undefined == currentLanguage){
      console.warn(`Language for locale ${locale} not found in available languages.`)
      currentLanguage = DEFAULT_LANGUAGE 
    }
  }
  
  // If the reload is on and buffer already has bundles, try to get them
  if(true == reloadBundles && 0 < buffer.size) {
    for (const bundleId of buffer.keys()) {
      await loadTextBundle(bundleId, true)
    }
  }
}

/**
 * Load a text bundle if needed 
 * @param id The bundle id 
 * @param maxAttemps (Optional) The max number of attemps, one by default
 * @author akrck02
 */
export async function loadTextBundle(id : string, reload = false, maxAttemps = 1) {

  // If the bundle exists, do nothing
  if(false == reload && buffer.has(id))
    return

  // Try to get the bundle retrying if necessary
  let language = undefined
  
  for (let attemps = 0; attemps < maxAttemps && undefined == language; attemps++) {
    language = await fetch(`${I18N_PATH}/${currentLanguage.main}/${id}.json`)
      .then(res => res.ok ? res.json() : undefined)
      .catch(() => undefined)
  }

  // If nothing was found, return
  if(undefined == language)
    return

  // Add the bundle to buffer
  buffer.set(id, language)
}

/**
 * Get text from a bundle 
 * @param bundleId The bundle id to take the text from
 * @param textId The text id
 * @author akrck02
 */
export function getText(bundleId : string, textId : string) : string {
  
  // If the bundle does not exists inside the buffer, return empty
  if(false == buffer.has(bundleId))
    return ""
  
  // If the text does not exist in the bundle, return empty
  const bundle = buffer.get(bundleId)
  if(false == bundle.hasOwnProperty(textId))
    return ""
 
  // Return the text
  return bundle[textId]
}

