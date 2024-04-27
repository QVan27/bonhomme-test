import { Transition } from '@unseenco/taxi'
import store from '../util/store'

/**
 * BaseTransition class for handling page transitions.
 * @class
 * @extends Transition
 */
export default class BaseTransition extends Transition {

  /**
   * Handles the leave transition.
   * @method
   * @param {Object} params - The parameters.
   * @param {Function} params.done - The callback to call when the transition is done.
   * @param {HTMLElement} params.from - The element to transition from.
   * @returns {void}
   */
  onLeave({ done, from }) {
    this.from = from
    store.smoothScroll && store.smoothScroll.stop()

    this.getElems()

    store.transitionComplete = false

    this.showLoader().then(() => {
      if (store.transitionComplete) this.transitionComplete()
      else window.addEventListener('transitionComplete', this.transitionComplete.bind(this), { once: true })

      done()
    })
  }

  /**
   * Handles the enter transition.
   * @method
   * @param {Object} params - The parameters.
   * @param {Function} params.done - The callback to call when the transition is done.
   * @param {HTMLElement} params.to - The element to transition to.
   * @returns {void}
   */
  onEnter({ done, to }) {
    this.to = to
    this.done = done

    this.getElems()
  }

  /**
   * Resets the scroll position.
   * @method
   * @returns {void}
   */
  resetScroll() {
    window.scrollTo(0, 0)

    if (store.scrollEngine === 'locomotive-scroll') {
      store.smoothScroll.setScroll(0, 0)
      store.smoothScroll.update()
      store.smoothScroll.start()
    } else if (store.scrollEngine === 'lenis') {
      store.smoothScroll.scrollTo(0, { immediate: true })
      store.smoothScroll.start()
      store.smoothScroll.scroll = 0
      store.smoothScroll.targetScroll = 0
    }
  }

  /**
   * Handles the transition complete event.
   * @method
   * @returns {void}
   */
  transitionComplete() {
    this.hideLoader(this.from, this.to).then(() => {
      this.resetScroll()
      this.done()
    })
  }

  /**
   * Hides the loader. To be implemented by subclasses.
   * @method
   * @returns {Promise} A promise that resolves when the loader is hidden.
   */
  hideLoader() { }

  /**
   * Shows the loader. To be implemented by subclasses.
   * @method
   * @returns {Promise} A promise that resolves when the loader is shown.
   */
  showLoader() { }

  /**
   * Gets the elements. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  getElems() { }
}
