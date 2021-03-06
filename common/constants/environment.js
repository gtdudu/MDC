/**
 * Browser
 *
 * @type {Boolean}
 */

// eslint-disable-next-line no-undef
const IS_BROWSER = typeof window === "object" && typeof document === 'object' && document.nodeType === 9;


/**
 * Browser matching rules.
 *
 * @type {Array}
 */

const BROWSER_RULES = [
  ['edge', /Edge\/([0-9\._]+)/],
  ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
  ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
  ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
  ['opera', /OPR\/([0-9\.]+)(:?\s|$)$/],
  ['ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/],
  ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
  ['ie', /MSIE\s(7\.0)/],
  ['android', /Android\s([0-9\.]+)/],
  ['safari', /Version\/([0-9\._]+).*Safari/],
]

/**
 * Operating system matching rules.
 *
 * @type {Array}
 */

const OS_RULES = [
  ['macos', /mac os x/i],
  ['ios', /os ([\.\_\d]+) like mac os/i],
  ['android', /android/i],
  ['firefoxos', /mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/i],
  ['windows', /windows\s*(?:nt)?\s*([\.\_\d]+)/i],
]

/**
 * Define variables to store the result.
 */

let BROWSER
let OS

/**
 * Run the matchers when in browser.
 */

if (IS_BROWSER) {
  // eslint-disable-next-line no-undef
  const { userAgent } = window.navigator

  for (const rule of BROWSER_RULES) {
    const [ name, regexp ] = rule
    if (regexp.test(userAgent)) {
      BROWSER = name
      break
    }
  }

  for (const rule of OS_RULES) {
    const [ name, regexp ] = rule
    if (regexp.test(userAgent)) {
      OS = name
      break
    }
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default IS_BROWSER
export const IS_CHROME = BROWSER === 'chrome'
export const IS_FIREFOX = BROWSER === 'firefox'
export const IS_SAFARI = BROWSER === 'safari'

export const IS_MAC = OS === 'macos'
export const IS_WINDOWS = OS === 'windows'
