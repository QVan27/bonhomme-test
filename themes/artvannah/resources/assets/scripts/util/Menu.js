/**
 * Menu class for handling menu open/close events.
 * @class
 */
export default class Menu {

  /**
   * Constructor for Menu class.
   * @constructor
   */
  constructor() {
    this.menuOpen = false
    this.isAnimating = false

    this.bindMethods()
    this.getElems()
    this.addEvents()

    this.onPageChange(window.location.href)
  }

  /**
   * Binds the class methods.
   * @method
   * @returns {void}
   */
  bindMethods() {
    this.toggle = this.toggle.bind(this)
  }

  /**
   * Gets the elements. To be implemented.
   * @method
   * @returns {void}
   */
  getElems() { }

  /**
   * Adds the event listeners.
   * @method
   * @returns {void}
   */
  addEvents() {
    this.toggler && this.toggler.addEventListener('click', this.toggle)
  }

  /**
   * Toggles the menu open/close state.
   * @method
   * @returns {void}
   */
  toggle() {
    if (this.isAnimating) return

    if (this.menuOpen) this.close()
    else this.open()
  }

  /**
   * Opens the menu.
   * @method
   * @returns {Promise} A promise that resolves when the menu is opened.
   */
  open() {
    return new Promise((resolve) => {
      this.menuOpen = true
      resolve()
    })
  }

  /**
   * Closes the menu.
   * @method
   * @returns {Promise} A promise that resolves when the menu is closed.
   */
  close() {
    return new Promise((resolve) => {
      this.menuOpen = false
      resolve()
    })
  }

  /**
   * Handles the resize event. To be implemented.
   * @method
   * @returns {void}
   */
  resize() { }

  /**
   * Handles the scroll event. To be implemented.
   * @method
   * @returns {void}
   */
  scroll() { }

  /**
   * Handles the page change event.
   * @method
   * @param {string} loc - The new location.
   * @returns {void}
   */
  // eslint-disable-next-line no-unused-vars
  onPageChange(loc) { }
}
