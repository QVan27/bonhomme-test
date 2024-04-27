import store from './store'

/**
 * Mousemove class for handling mouse or touch move events.
 * @class
 */
export default class Mousemove {
  /**
   * Constructor for Mousemove class.
   * @constructor
   * @param {Object} params - The parameters for the Mousemove class.
   * @param {HTMLElement|string} params.el - The element or the selector of the element to attach the event listener to.
   * @param {Function} params.cb - The callback function to be called when the event is triggered.
   * @param {boolean} [params.mobile=false] - A flag indicating whether the event listener should be attached for mobile devices.
   */
  constructor({ el, cb, mobile = false }) {
    this.cb = cb
    this.mobile = mobile

    // eslint-disable-next-line
    this.el = typeof el === 'string' ? document.querySelector(el) : (el === undefined ? document : el)
    this.run = this.run.bind(this)
  }

  /**
   * Starts listening to the mousemove or touchmove event.
   * @method
   */
  on() {
    this.listener('add')
  }

  /**
   * Stops listening to the mousemove or touchmove event.
   * @method
   */
  off() {
    this.listener('remove')
  }

  /**
   * Adds or removes the event listener.
   * @method
   * @param {string} a - The action to perform ('add' or 'remove').
   */
  listener(a) {
    if (this.mobile && store.detect.isMobile) this.el[a + 'EventListener']('touchmove', this.run)
    else this.el[a + 'EventListener']('mousemove', this.run)
  }

  /**
   * The callback for the event listener.
   * @method
   * @param {Event} e - The event object.
   */
  run(e) {
    const x = e.changedTouches ? e.changedTouches[0].pageX : e.pageX
    const y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY

    this.cb(x, y, e)
  }
}
