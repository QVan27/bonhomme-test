import gsap from 'gsap'
import BaseTransition from './baseTransition'
import store from '../util/store'

/**
 * Fade class for handling fade transitions.
 * @class
 * @extends BaseTransition
 */
export default class Fade extends BaseTransition {

  /**
   * Constructor for Fade class.
   * @constructor
   * @param {Object} e - The event object.
   */
  constructor(e) {
    super(e)
  }

  /**
   * Hides the loader with a fade out animation.
   * @method
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  hideLoader() {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (store.scrollEngine === 'locomotive-scroll') store.smoothScroll.update()

          this.resetScroll()
          resolve()
        }
      })

      tl.to(store.panel, {
        opacity: 0,
        duration: 0.35,
        ease: 'power3.out'
      }, 0)
    })
  }

  /**
   * Shows the loader with a fade in animation.
   * @method
   * @returns {Promise} A promise that resolves when the animation is complete.
   */
  showLoader() {
    return new Promise((resolve) => {
      gsap.to(store.panel, {
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => {
          resolve()
        }
      })
    })
  }
}
