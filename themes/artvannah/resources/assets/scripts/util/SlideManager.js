/* eslint-disable */
/**
 * @class SlideManager
 * @classdesc Manage slides for a slideshow.
 */
export default class SlideManager {
  /**
   * @constructor
   * @param {Object} opt - The options for the SlideManager.
   * @param {HTMLElement} opt.el - The element to manage.
   * @param {Boolean} [opt.loop=false] - If the slideshow should loop.
   * @param {Boolean} [opt.random=false] - If the slideshow should go to a random slide.
   * @param {Boolean} [opt.vertical=false] - If the slideshow should be vertical.
   * @param {Function} opt.callback - The callback function to call when the slide changes.
   * @param {Boolean} [opt.auto=false] - If the slideshow should auto change.
   * @param {Number} [opt.interval=5] - The interval in seconds for the auto change.
   * @param {Boolean} [opt.init=true] - If the SlideManager should init on creation.
   * @param {Boolean} [opt.swipe=true] - If the SlideManager should listen to swipe events.
   * @param {Boolean} [opt.mouseSwipe=false] - If the SlideManager should listen to mouse swipe events.
   * @param {Number} [opt.threshold=60] - The threshold for the swipe.
   * @param {Number} [opt.startAt=0] - The index to start at.
   * @param {Number} [opt.length] - The length of the slides.
   * 
   * @returns {void}
   */
  constructor(opt = {}) {
    if (!opt.callback) {
      console.error('SlideManager error: You must give a callback')

      return
    }

    this.intervalFn = this.intervalFn.bind(this)
    this.startAuto = this.startAuto.bind(this)
    this.stopAuto = this.stopAuto.bind(this)
    this.el = opt.el
    this.changing = false
    this.index = 0
    this.max = -1

    if (opt.length > 0) this.max = opt.length
    else if (this.el.children) this.max = this.el.children.length

    if (this.max === -1) {
      console.error('SlideManager error: You must give an element or a length')

      return
    }

    const defaults = {
      el: null,
      loop: false,
      random: false,
      vertical: false,
      callback: () => { },
      auto: false,
      interval: 5,
      init: true,
      swipe: true,
      mouseSwipe: false,
      threshold: 60
    }

    this.options = Object.assign(defaults, opt)

    if (opt.startAt !== this.index && opt.startAt > 0) {
      if (opt.startAt > this.max) this.index = this.max
      else this.index = opt.startAt
    }

    this.intervalID = null

    this.touch = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }

    this.diagonalMax = 125

    this.options.callback = this.options.callback.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchEnd = this.touchEnd.bind(this)

    if (this.options.init) this.init()
  }

  /**
   * Initializes the SlideManager.
   * 
   * This method is automatically called by constructor by default.
   * 
   * @public
   * @returns {SlideManager} The SlideManager instance.
   */
  init() {
    if (this.max === 0) return null

    if (this.options.auto) {
      window.addEventListener('blur', this.stopAuto)
      window.addEventListener('focus', this.startAuto)

      this.startAuto()
    }

    if (this.options.swipe) this.events()

    return this
  }

  /**
   * Destroys the SlideManager.
   *
   * This method removes all event listeners and stops the auto change.
   *
   * @public
   * @returns {SlideManager} - This instance.
   */
  destroy() {
    if (this.max === 0) return null

    this.changing = false

    if (this.options.swipe && this.el) {
      if (this.options.mouseSwipe) {
        this.el.removeEventListener('mousedown', this.touchStart, false)
        this.el.removeEventListener('mouseup', this.touchEnd, false)
      }

      this.el.removeEventListener('touchstart', this.touchStart, false)
      this.el.removeEventListener('touchend', this.touchEnd, false)
    }

    if (this.options.auto) {
      window.removeEventListener('blur', this.stopAuto)
      window.removeEventListener('focus', this.startAuto)

      this.stopAuto()
    }

    return this
  }

  /**
   * Gets the current index.
   * 
   * @public
   * @returns {Number} - The current index.
   */
  getIndex() {
    return this.index
  }

  /**
   * Goes to the previous slide.
   * 
   * @public
   * @returns {void}
   */
  prev() {
    this.goTo(this.index - 1)
  }

  /**
   * Goes to the next slide.
   * 
   * @public
   * @returns {void}
   */
  next() {
    this.goTo(this.index + 1)
  }

  /**
   * Goes to a given element in the slider.
   *
   * @param {Number} index - The target index you want to move to.
   * @param {*} data - Any data you want to retreive when the `callback` will be called.
   *
   * @public
   * @returns {void}
   */
  goTo(index, data) {
    if (index === this.index || this.isChanging()) return

    const checkedIndex = this.checkLoop(index)
    const event = this.createEvent(checkedIndex, data)

    if (checkedIndex === this.index) {
      this.changing = false

      return
    }

    this.index = checkedIndex
    this.options.callback(event)
  }

  /**
   * Marks the SlideManager as done changing slides.
   */
  done() {
    this.changing = false

    if (this.options.auto) this.startAuto()
  }

  // Private functions

  /**
   * Initiates the events (touch swipe and mouse swipe).
   *
   * @private
   * @returns {void}
   */
  events() {
    if (!this.el) return

    if (this.options.mouseSwipe) {
      this.el.addEventListener('mousedown', this.touchStart, false)
      this.el.addEventListener('mouseup', this.touchEnd, false)
    }

    this.el.addEventListener('touchstart', this.touchStart, { passive: true })
    this.el.addEventListener('touchend', this.touchEnd, false)
  }

  /**
   * The touchstart event callback.
   *
   * @private
   * @param {TouchEvent} event - The TouchEvent.
   */
  touchStart(event) {
    this.touch.startX = event.type === 'touchstart' ? event.touches[0].screenX : event.screenX
    this.touch.startY = event.type === 'touchstart' ? event.touches[0].screenY : event.screenY
  }

  /**
   * The touchend event callback.
   *
   * @private
   * @param {TouchEvent} event - The TouchEvent.
   */
  touchEnd(event) {
    this.touch.endX = event.type === 'touchend' ? event.changedTouches[0].screenX : event.screenX
    this.touch.endY = event.type === 'touchend' ? event.changedTouches[0].screenY : event.screenY

    this.handleSwipe()
  }

  /**
   * Checks if the touch gesture is going to X axis or not.
   *
   * @private
   * @returns {Boolean} - `true` if the gesture is going to X axis, `false` if not going to X axis.
   */
  isGoingToX() {
    return this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX <= this.diagonalMax || this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX <= this.diagonalMax
  }

  /**
   * Checks if the touch gesture is going to Y axis or not.
   *
   * @private
   * @returns {Boolean} - `true` if the gesture is going to Y axis, `false` if not going to Y axis.
   */
  isGoingToY() {
    return this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY <= this.diagonalMax || this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY <= this.diagonalMax
  }

  /**
   * Manages the touchend event calculation to define if a slide needs to be made or not.
   *
   * @private
   * @returns {void}
   */
  handleSwipe() {
    if (this.changing) return

    if (this.options.vertical) {
      if (this.touch.endY < this.touch.startY && this.touch.startY - this.touch.endY >= this.options.threshold) {
        if (this.isGoingToX()) this.callback(-1)
      }
      if (this.touch.endY > this.touch.startY && this.touch.endY - this.touch.startY >= this.options.threshold) {
        if (this.isGoingToX()) this.callback(1)
      }
    } else {
      if (this.touch.endX < this.touch.startX && this.touch.startX - this.touch.endX >= this.options.threshold) {
        if (this.isGoingToY()) this.callback(-1)
      }
      if (this.touch.endX > this.touch.startX && this.touch.endX - this.touch.startX >= this.options.threshold) {
        if (this.isGoingToY()) this.callback(1)
      }
    }
  }

  /**
   * Starts the automatic slide change interval.
   * @private
   */
  startAuto() {
    if (this.intervalID) this.stopAuto()

    this.intervalID = setInterval(this.intervalFn, this.options.interval * 1000)
  }

  /**
   * The function to call at each interval.
   * @private
   */
  intervalFn() {
    if (this.changing) return

    this.callback(-1)
  }

  /**
   * Stops the automatic slide change interval.
   * @private
   */
  stopAuto() {
    clearInterval(this.intervalID)

    this.intervalID = null
  }

  /**
   * Determines if the SlideManager is currently changing slides.
   * @private
   * @returns {boolean} Whether the SlideManager is currently changing slides.
   */
  isChanging() {
    if (this.changing) return true

    this.changing = true

    return false
  }

  /**
   * Calculates a new slide index based on a delta.
   * @private
   * @param {number} delta - The delta to apply to the current index.
   * @returns {number} The new slide index.
   */
  newIndex(delta) {
    return this.checkLoop(delta > 0 ? this.index - 1 : this.index + 1)
  }

  /**
   * Calculates a new random slide index.
   * @private
   * @returns {number} The new random slide index.
   */
  newRandomIndex() {
    let randIndex

    do {
      randIndex = Math.floor(Math.random() * this.max)
    } while (randIndex === this.index)

    return randIndex
  }

  /**
   * Checks a slide index and applies looping if necessary.
   * @private
   * @param {number} index - The slide index to check.
   * @returns {number} The checked slide index.
   */
  checkLoop(index) {
    return index < 0 ? this.options.loop ? this.max - 1 : 0 : index > this.max - 1 ? this.options.loop ? 0 : this.max - 1 : index
  }

  /**
   * Creates an event object for a slide change.
   * @private
   * @param {number} newIndex - The new slide index.
   * @param {Object} data - Additional data to include in the event.
   * @returns {Object} The event object.
   */
  createEvent(newIndex, data = {}) {
    let direction = newIndex > this.index ? 1 : -1

    if (this.max > 2) {
      if (this.index === 0 && newIndex === this.max - 1) direction = -1
      else if (this.index === this.max - 1 && newIndex === 0) direction = 1
    }

    return {
      new: newIndex,
      previous: this.index,
      direction,
      data
    }
  }

  /**
   * Calls the callback with a delta.
   * @private
   * @param {number} delta - The delta to pass to the callback.
   */
  callback(delta) {
    if (this.isChanging()) return

    const index = this.options.random ? this.newRandomIndex() : this.newIndex(delta)
    const event = this.createEvent(index)

    if (index === this.index) {
      this.changing = false

      return
    }

    if (this.options.auto) this.stopAuto()

    this.index = index
    this.options.callback(event)
  }
}
