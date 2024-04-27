import gsap from 'gsap'
import store from './store'

/**
 * Loader class for handling the loading animation.
 * @class
 */
export default class Loader {

  /**
   * Constructor for Loader class.
   * @constructor
   */
  constructor() {
    this.getElems()
  }

  /**
   * Gets the elements and stores them in the store.
   * @method
   * @returns {void}
   */
  getElems() {
    store.panel = document.querySelector('.panel')
  }

  /**
   * Plays the loading animation.
   * @method
   * @returns {Promise} A promise that resolves when the loading animation is complete.
   */
  play() {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Initialize the menu if it exists and the device is not mobile.
          store.menu && !store.detect.isMobile && store.menu.init()

          // Dispatch a custom event to signal that the loading is complete.
          window.dispatchEvent(new CustomEvent('loaderComplete'))

          // Set the isFirstLoaded flag to true.
          store.isFirstLoaded = true

          // Resolve the promise.
          resolve()
        }
      })

      // Animate the panel's opacity to 0.
      // eslint-disable-next-line prefer-reflect
      tl
        .to(store.panel, {
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
    })
  }
}
