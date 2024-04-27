import Splitting from 'splitting'

/**
 * Class to wrap lines of text in HTML elements.
 * This class uses the Splitting.js library to split text into lines and characters.
 *
 * @class
 */
export default class WrapLines {
  /**
   * Creates an instance of WrapLines.
   *
   * @param {Object} options - The options for the instance.
   * @param {HTMLElement} options.el - The element to wrap lines in.
   * @param {string} [options.className='line'] - The class name for the line elements.
   * @param {string} options.option - The option for how to wrap lines.
   * @memberof WrapLines
   */
  constructor({ el, className = 'line', option }) {
    this.el = el
    this.html = el.innerHTML
    this.className = className
    this.option = option
    this.lines = []

    Splitting.add({
      by: 'lines-char',
      key: 'lineWord',
      depends: ['chars', 'lines']
    })

    this.wrap()
  }

  /**
   * Wraps lines in the element based on the option.
   *
   * @memberof WrapLines
   */
  wrap() {
    if (this.option === 'content') {
      this.lines = {
        linesWords: []
      }

      const els = this.el.querySelectorAll('h3, p, ul')

      for (let i = 0; i < els.length; i++) {
        const by = els[i].tagName === 'UL' ? 'items' : 'lines'
        const l = new Splitting({
          target: els[i],
          by
        })[0]

        this.lines.linesWords.push(...l[by])
      }
    } else if (this.option === 'wrap') {
      this.wrapLines()
    } else {
      this.lines = new Splitting({
        target: this.el,
        by: 'lines-char'
      })[0]

      this.lines.linesChars = []

      for (let i = 0; i < this.lines.lines.length; i++) {
        this.lines.linesChars[i] = []

        for (let j = 0; j < this.lines.lines[i].length; j++) {
          this.lines.linesChars[i].push(...this.lines.lines[i][j].querySelectorAll('.char'))
        }
      }
    }
  }

  /**
   * Replaces bold and color elements with span elements, and wraps each line of text
   * in a div element with a specified class name. It also checks each word to see if it was 
   * originally bold or colored, and if so, adds the corresponding class to the word element.
   *
   * @function
   * @memberof WrapLines
   * @name wrapLines
   * @returns {void}
   */
  wrapLines() {
    // Get all bold and color elements
    const bolds = this.el.querySelectorAll('b, strong')
    const colors = this.el.querySelectorAll('.color')

    // Replace bold elements with span elements
    for (let i = 0; i < bolds.length; i++) {
      const b = bolds[i]
      const parent = b.parentNode
      const text = b.textContent
      const span = document.createElement('span')

      span.textContent = text
      parent.replaceChild(span, b)
    }

    // Replace color elements with span elements
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i]
      const parent = c.parentNode
      const text = c.textContent
      const span = document.createElement('span')

      span.textContent = text
      parent.replaceChild(span, c)
    }

    // eslint-disable-next-line object-property-newline
    const lines = new Splitting({ target: this.el, by: 'lines' })[0].lines

    let html = ''

    for (let i = 0; i < lines.length; i++) {
      const lineEl = document.createElement('div')
      const line = document.createElement('div')

      lineEl.classList.add('l-wrap')
      line.classList.add(this.className)
      line.style.setProperty('--w-line-index', i)
      line.style.setProperty('--w-total-index', lines.length)

      for (let j = 0; j < lines[i].length; j++) {
        const word = lines[i][j]
        const whitespace = word.nextSibling

        // Check if word is bold
        for (let k = 0; k < bolds.length; k++) {
          const bold = bolds[k].textContent
          const boldWords = bold.split(' ')

          if (boldWords.includes(word.textContent)) {
            word.classList.add('bold')
            break
          }
        }

        // Check if word is color
        for (let l = 0; l < colors.length; l++) {
          const color = colors[l].textContent
          const colorWords = color.split(' ')

          if (colorWords.includes(word.textContent)) {
            word.classList.add('color')
            break
          }
        }

        line.appendChild(word)
        whitespace && line.appendChild(whitespace)
      }

      lineEl.appendChild(line)
      html += lineEl.outerHTML
    }

    this.el.innerHTML = html;
    this.lines = this.el.querySelectorAll(`.${this.className}`)
  }
}
