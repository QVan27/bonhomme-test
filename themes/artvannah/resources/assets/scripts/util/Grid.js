/**
 * Grid class for handling grid visibility.
 * @class
 */
export default class Grid {

  /**
   * Constructor for Grid class.
   * @constructor
   */
  constructor() {
    this.getElems()
    this.addEvents()
  }

  /**
   * Gets the grid element.
   * @method
   * @returns {void}
   */
  getElems() {
    this.grid = document.querySelector('.grid')
  }

  /**
   * Adds the keydown event listener.
   * @method
   * @returns {void}
   */
  addEvents() {
    document.addEventListener('keydown', (e) => {
      // If the grid exists and the 'g' key is pressed, toggle the 'g' class on the grid.
      this.grid && this.grid.classList.toggle('g', !this.grid.classList.contains('g') && e.key === 'g')
    })
  }
}

