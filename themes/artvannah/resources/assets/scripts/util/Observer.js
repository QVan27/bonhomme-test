import store from './store'

/**
 * Observer class for handling intersection events.
 * @class
 */
export default class Observer {

  /**
   * Constructor for Observer class.
   * @constructor
   */
  constructor() {
    this.onObserve = this.onObserve.bind(this)
    this.observed = []

    this.initObserver()
  }

  /**
   * Initializes the IntersectionObserver instance.
   * @method
   * @returns {IntersectionObserver} The IntersectionObserver instance.
   */
  initObserver() {
    this.observer = new IntersectionObserver(this.onObserve, {
      rootMargin: '0px',
      threshold: 0
    })
  }

  /**
   * Starts observing elements with the class 'observe'.
   * @method
   * @returns {void}
   */
  on() {
    this.observed = []
    this.$elems = document.querySelectorAll('.observe')

    for (let i = 0; i < this.$elems.length; i++) {
      this.observe({
        el: this.$elems[i],
        repeat: this.$elems[i].dataset.observerRepeat !== undefined,
        class: true
      })
    }
  }

  /**
   * Stops observing all currently observed elements.
   * @method
   * @returns {void}
   */
  off() {
    for (let i = 0; i < this.observed.length; i++) this.unobserve(this.observed[i].el)
  }

  /**
   * Adds an element to the list of observed elements.
   * @method
   * @param {Object} observable - The object to observe.
   * @returns {void}
   */
  observe(observable) {
    this.observed.push(observable)
    this.observer.observe(observable.el)
  }

  /**
   * Removes an element from the list of observed elements.
   * @method
   * @param {HTMLElement} el - The element to stop observing.
   * @returns {void}
   */
  unobserve(el) {
    this.observer.unobserve(el)
  }

  /**
   * Callback for the IntersectionObserver.
   * @method
   * @param {Array} entries - The IntersectionObserver entries.
   * @returns {void}
   */
  onObserve(entries) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]

      if (entry.isIntersecting) {
        const target = this.observed.filter((obs) => obs.el === entry.target)[0]

        target.hasIntersected = true
        target.cb && target.cb(true)
        target.class && target.el.classList.add('in-view')
        !target.repeat && this.unobserve(target.el)
      } else {
        const target = this.observed.filter((obs) => obs.el === entry.target)[0]

        if (target.hasIntersected) {
          target.repeat && target.class && target.el.classList.remove('in-view')
          target.repeat && target.cb && target.cb(false)
          target.once && store.smoothScroll.direction === 1 && this.unobserve(target.el)
        }
      }
    }
  }
}
