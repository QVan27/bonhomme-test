/**
 * The main store object that contains various properties and methods.
 * @namespace
 */
export default {

  /** @property {boolean} debug - Debug mode status. */
  debug: window.App.debug,

  /**
   * @property {string} scrollEngine - The scroll engine to use.
   * Available values: 'locomotive-scroll', 'lenis', false
   */
  scrollEngine: 'lenis',

  /** @property {object} smoothScroll - The smooth scroll object. */
  smoothScroll: null,

  /** @property {object} observer - The observer object. */
  observer: null,

  /** @property {object} panel - The panel object. */
  panel: null,

  /** @property {boolean} isFirstLoaded - Whether the page has been loaded for the first time. */
  isFirstLoaded: false,

  /** @property {object} modules - The modules object. */
  modules: {},

  /**
   * @property {object} detect - An object containing methods for detecting various device and browser properties.
   */
  detect: {

    /** @property {string} uA - The user agent string in lowercase. */
    uA: navigator.userAgent.toLowerCase(),

    /** @property {boolean} iPadIOS13 - Whether the device is an iPad running iOS 13 or later. */
    get iPadIOS13() {
      return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
    },

    /** @property {boolean} isMobile - Whether the device is a mobile device. */
    get isMobile() {
      return window.App.debug ? (/mobi|android|tablet|ipad|iphone/).test(this.uA) && window.innerWidth <= 1024 || this.iPadIOS13 : (/mobi|android|tablet|ipad|iphone/).test(this.uA) || this.iPadIOS13
    },

    /** @property {boolean} isMobileAndroid - Whether the device is an Android mobile device. */
    get isMobileAndroid() {
      return (/android.*mobile/).test(this.uA)
    },

    /** @property {boolean} isFirefox - Whether the browser is Firefox. */
    get isFirefox() {
      return this.uA.indexOf('firefox') > -1
    },

    /** @property {boolean} isAndroid - Whether the device is an Android device. */
    get isAndroid() {
      return this.isMobileAndroid || !this.isMobileAndroid && (/android/i).test(this.uA)
    },

    /** @property {boolean} safari - Whether the browser is Safari. */
    get safari() {
      return this.uA.match(/version\/[\d.]+.*safari/)
    },

    /** @property {boolean} isSafari - Whether the browser is Safari and the device is not Android. */
    get isSafari() {
      return this.safari && !this.isAndroid
    }
  },

  /**
   * Linear interpolation function.
   * @param {number} s - The start value.
   * @param {number} e - The end value.
   * @param {number} v - The interpolation value between the two numbers.
   * @returns {number} The interpolated value.
   */
  lerp: (s, e, v) => s * (1 - v) + e * v,

  /**
   * Clamps a value between two numbers.
   * @param {number} v - The value to clamp.
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} The clamped value.
   */
  clamp: (v, min, max) => Math.min(Math.max(v, min), max),

  /**
   * Maps a number from one range to another.
   * @param {number} x - The input number.
   * @param {number} a - The beginning of the input range.
   * @param {number} b - The end of the input range.
   * @param {number} c - The beginning of the output range.
   * @param {number} d - The end of the output range.
   * @returns {number} The output number.
   */
  map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,

  /**
   * Rounds a number to a certain number of decimal places.
   * @param {number} v - The number to round.
   * @param {number} d - The number of decimal places.
   * @returns {number} The rounded number.
   */
  round: (v, d) => {
    const e = d ? Math.pow(10, d) : 100

    return Math.round(v * e) / e
  },

  /**
   * Wraps a value into a certain range.
   * @param {number} v - The value to wrap.
   * @param {number} min - The minimum value of the range.
   * @param {number} max - The maximum value of the range.
   * @returns {number} The wrapped value.
   */
  wrap: (v, min, max) => {
    const r = max - min
    const func = (e) => (r + (e - min) % r) % r + min

    return v || v === 0 ? func(v) : func
  }
}
