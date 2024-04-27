import store from './store'

/**
 * Allow to add parallax on elements using data-attributes.
 * data-parallax : Element parallax speed. A negative value will reverse the direction.
 * data-offset : Element in-view trigger offset : bottom,top.
  First value is bottom offset, second (optional) is top offset.
  Percent is relative to viewport height, otherwise it's absolute pixels.
  E.g. "10", "100,50%", "25%, 15%"

 * ⚠️ Uncomment import in main.js to use this class.
 * ⚠️ This class has to be used with Lenis scroll engine.
 */
export default class Parallax {
  /**
   * Method to initialize the parallax effect on the elements.
   * It sets up the elements and their properties for the parallax effect.
   */
  on() {
    this.els = []
    this.dom = document.querySelectorAll('[data-parallax]')

    for (let i = 0; i < this.dom.length; i++) {
      const dom = this.dom[i]
      const bounds = dom.getBoundingClientRect()
      const offset = dom.dataset.offset ? dom.dataset.offset.split(',') : null
      const relativeOffset = [0, 0]

      if (offset) {
        for (let k = 0; k < offset.length; k++) {
          // eslint-disable-next-line max-depth
          if (offset[k].includes('%')) {
            relativeOffset[k] = parseInt(offset[k].replace('%', '') * store.w.h) / 100
          } else {
            relativeOffset[k] = parseInt(offset[k])
          }
        }
      }

      this.els.push({
        dom,
        speed: dom.dataset.parallax / 10,
        inView: false,
        out: false,
        viewed: false,
        bounds: {
          top: bounds.top - store.w.h + relativeOffset[0],
          bottom: bounds.bottom - relativeOffset[1]
        }
      })
    }

    for (let i = 0; i < this.els.length; i++) {
      store.observer.observe({
        el: this.els[i].dom,
        repeat: true,
        cb: (e) => {
          this.els[i].inView = e
        }
      })

      const { bounds, dom, speed } = this.els[i]

      dom.style.transform = `translate3d(0, ${bounds.top * speed}px, 0)`
    }
  }

  /**
   * Method to handle the scroll event.
   * It updates the position of the elements based on the scroll position.
   *
   * @param {number} e - The scroll position.
   */
  scroll(e) {
    const s = store.round(e, 3)

    for (let i = 0; i < this.els.length; i++) {
      const { bounds, dom, speed, inView, out, viewed } = this.els[i]

      if (inView) {
        this.els[i].out && (this.els[i].out = false)
        this.els[i].viewed = true
        dom.style.transform = `translate3d(0, ${-(s - bounds.top) * speed}px, 0)`
      } else if (!out && viewed) {
        this.els[i].out = true
        dom.style.transform = `translate(0, ${-(s - bounds.top) * speed}px)`
      }
    }
  }
}
