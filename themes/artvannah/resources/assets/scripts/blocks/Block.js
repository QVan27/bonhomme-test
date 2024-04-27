/**
 * Block class for handling block-related events.
 * @class
 */
export default class Block {

  /**
   * Constructor for Block class.
   * @constructor
   * @param {HTMLElement} el - The element.
   * @param {boolean} destroyLast - Whether to destroy the last block.
   */
  constructor(el, destroyLast) {
    this.el = el;
    this.destroyLast = destroyLast;

    this.bindMethods()
    this.getElems()
    this.init()
    this.events()
  }

  /**
   * Handles the enter completed event. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  onEnterCompleted() { }

  /**
   * Binds the methods. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  bindMethods() { }

  /**
   * Gets the elements. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  getElems() { }

  /**
   * Initializes the block. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  init() { }

  /**
   * Adds the events. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  events() { }

  /**
   * Destroys the block. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  destroy() { }

  /**
   * Handles the resize event. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  resize() { }

  /**
   * Handles the scroll event. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  scroll() { }

  /**
   * Checks if the block is in view. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  inView() { }

  /**
   * Updates the block. To be implemented by subclasses.
   * @method
   * @returns {void}
   */
  update() { }
}
