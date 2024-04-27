import store from './store'

/**
 * Anchor class for handling anchor-related events.
 * @class
 */
export default class Anchor {

  /**
   * Constructor for Anchor class.
   * @constructor
   */
  constructor() {
    this.offset = store.w.w > 1200 ? -150 : -75
    this.index = 0

    this.getElems()
    this.init()
    this.events()
  }

  /**
   * Gets the anchor elements.
   * @method
   * @returns {void}
   */
  getElems() {
    this.$anchors = document.querySelectorAll('a[href^="#"]')
  }

  /**
   * Initializes the anchors.
   * @method
   * @returns {void}
   */
  init() {
    this.anchors = []

    for (let i = 0; i < this.$anchors.length; i++) {
      const id = this.$anchors[i].getAttribute('href')

      if (id !== '#') {
        const element = document.querySelector(id)
        const anchor = document.createElement('div')

        anchor.classList = this.$anchors[i].classList
        anchor.innerHTML = this.$anchors[i].innerHTML

        this.$anchors[i].parentNode.insertBefore(anchor, this.$anchors[i]);
        this.$anchors[i].parentNode.removeChild(this.$anchors[i]);

        this.anchors[this.index] = {
          button: anchor,
          target: element
        }

        this.index++
      }
    }
  }

  /**
   * Adds the click event listeners to the anchors.
   * @method
   * @returns {void}
   */
  events() {
    for (let i = 0; i < this.anchors.length; i++) {
      this.anchors[i].button.addEventListener('click', this.scrollTo.bind(this, i))
    }
  }

  /**
   * Scrolls to the target of the anchor.
   * @method
   * @param {number} i - The index of the anchor.
   * @returns {void}
   */
  scrollTo(i) {
    store.smoothScroll.scrollTo(this.anchors[i].target, { offset: this.offset })

    if (store.scrollEngine === 'locomotive-scroll') store.smoothScroll.update()
  }
}
