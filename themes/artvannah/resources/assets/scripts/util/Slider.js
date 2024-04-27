import SlideManager from './SlideManager'

/**
 * Slider class for managing slides.
 */
export default class Slider {
  /**
   * Slider constructor.
   * @param {Object} options - The options for the slider.
   * @param {HTMLElement} options.el - The slider element.
   * @param {Array} options.pagers - The pager elements.
   * @param {Array} options.data - The data for the slides.
   * @param {Function} options.cb - The callback function for slide changes.
   */
  constructor({ el, pagers, data, cb }) {
    this.el = el
    this.pagers = pagers
    this.data = data
    this.cb = cb
    this.inView = false

    this.bindMethods()
  }

  /**
   * Initializes the slider.
   */
  init() {
    this.instance = new SlideManager({
      length: this.data.length,
      loop: true,
      callback: (event) => {
        this.old = event.previous
        this.current = event.new
        this.direction = event.direction

        this.cb(this.data[this.old], this.data[this.current]).then(this.instance.done.bind(this.instance))
      }
    })

    this.listener('add')
  }

  /**
   * Binds the methods to the instance.
   */
  bindMethods() {
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.key = this.key.bind(this)
  }

  /**
   * Adds or removes event listeners.
   * @param {string} a - The action to perform ('add' or 'remove').
   */
  listener(a) {
    if (this.pagers) {
      this.pagers[0][a + 'EventListener']('click', this.prev)
      this.pagers[1][a + 'EventListener']('click', this.next)
    }
    document[a + 'EventListener']('keydown', this.key)
  }

  /**
   * Destroys the slider.
   */
  destroy() {
    this.listener('remove')
  }

  /**
   * Goes to the previous slide.
   */
  prev() {
    this.instance.prev()
  }

  /**
   * Goes to the next slide.
   */
  next() {
    this.instance.next()
  }

  /**
   * Handles key events.
   * @param {KeyboardEvent} e - The keyboard event.
   */
  key(e) {
    if (!this.inView) return

    if (e.key === 'ArrowLeft') this.prev()
    else if (e.key === 'ArrowRight') this.next()
  }
}
