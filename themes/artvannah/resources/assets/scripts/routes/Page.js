import { Renderer } from '@unseenco/taxi'
import blockList from '../blocks/blockList'
import store from '../util/store'

/**
 * This class represents a page and handles its lifecycle events.
 * @class
 * @extends {Renderer}
 */
export default class Page extends Renderer {

  /**
   * Called when the page is initially loaded.
   * It calls the onEnter and onEnterCompleted methods.
   * @returns {void}
   */
  initialLoad() {
    this.onEnter()
    this.onEnterCompleted()
  }

  /**
   * Called when the page starts entering.
   * It initializes the blocks and preloads the links if it's the first load.
   * @returns {void}
   */
  onEnter() {
    this.view = this.content
    this.startBlocksEnterCompleted = this.startBlocksEnterCompleted.bind(this)

    store.isFirstLoaded && this.preload()

    this.blockList = blockList
    this.blocks = []
    if (this.blockList && this.blockList.length) this.initBlocks()
  }

  /**
   * Preloads the links in the view.
   * @returns {void}
   */
  preload() {
    const links = this.view.querySelectorAll('a')

    for (let i = 0; i < links.length; i++) {
      !store.router.cache.has(links[i].href) && store.router.preload(links[i].href)
    }
  }

  /**
   * Initializes the blocks in the view.
   * It filters out the blocks that are not for mobile if the device is mobile.
   * It also dynamically imports the block files and creates instances of them.
   * @returns {void}
   */
  initBlocks() {
    store.detect.isMobile && (this.blockList = this.blockList.filter((e) => e.mobile !== false))

    let totalBlocks = 0
    let loadedBlocks = 0

    for (let i = 0; i < this.blockList.length; i++) {
      const foundBlocks = this.view.querySelectorAll('.' + this.blockList[i].name)

      totalBlocks += foundBlocks.length
    }

    if (!store.isFirstLoaded && totalBlocks === 0) store.loader.play()

    for (let i = 0; i < this.blockList.length; i++) {
      const foundBlocks = this.view.querySelectorAll('.' + this.blockList[i].name)
      const block = {
        name: this.blockList[i].name,
        instances: []
      }

      for (let j = 0; j < foundBlocks.length; j++) {
        const { fileName, hasMobileBlock } = this.blockList[i]
        const file = store.detect.isMobile && hasMobileBlock ? 'mobile/' + fileName : fileName

        // eslint-disable-next-line no-loop-func
        import('../blocks/' + file).then(({ default: BlockInstance }) => {
          loadedBlocks++
          block.instances.push({
            el: foundBlocks[j],
            class: new BlockInstance(foundBlocks[j])
          })

          if (loadedBlocks === totalBlocks) {
            if (store.isFirstLoaded) {
              store.transitionComplete = true
              window.dispatchEvent(new CustomEvent('transitionComplete'))
            } else store.loader.play()
          }
        })
      }

      this.blocks.push(block)
    }
  }

  /**
   * Called when the page has completely entered.
   * It starts the blocks' enter completed sequence.
   * If it's not the first load, it waits for the loader to complete before starting the sequence.
   * @returns {void}
   */
  onEnterCompleted() {
    if (store.isFirstLoaded) this.startBlocksEnterCompleted()
    else window.addEventListener('loaderComplete', this.startBlocksEnterCompleted)
  }

  /**
   * Starts the blocks' enter completed sequence.
   * It turns on the observer and the parallax module if they exist.
   * It also observes each block instance and calls its onEnterCompleted method.
   * @returns {void}
   */
  startBlocksEnterCompleted() {
    if (store.scrollEngine === 'lenis' || !store.scrollEngine) store.observer && store.observer.on()

    store.modules.parallax && store.modules.parallax.on()

    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].instances.length; j++) {
        const { el, once } = this.blocks[i].instances[j].class

        this.blocks[i].instances[j].class.onEnterCompleted()

        store.observer.observe({
          el,
          repeat: true,
          once,
          cb: (e) => {
            this.blocks[i].instances[j].class.isInView = e
            this.blocks[i].instances[j].class.inView(e)
          }
        })
      }
    }
  }

  /**
   * Called when the page starts leaving.
   * It turns off the observer if it exists and destroys the block instances that don't have the destroyLast property set to true.
   * @returns {void}
   */
  onLeave() {
    if (store.scrollEngine === 'lenis' || !store.scrollEngine) store.observer.off()

    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].instances.length; j++) {
        if (!this.blocks[i].instances[j].class.destroyLast) this.blocks[i].instances[j].class.destroy()
      }
    }
  }

  /**
   * Called when the page has completely left.
   * It turns off the observer if it exists and destroys the block instances that have the destroyLast property set to true.
   * @returns {void}
   */
  onLeaveCompleted() {
    store.observer && store.observer.off()

    // Destroy blocks with `destroyLast` property set to `true`
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].instances.length; j++) {
        if (this.blocks[i].instances[j].class.destroyLast) this.blocks[i].instances[j].class.destroy()
      }
    }
  }

  /**
   * Called when the window is resized.
   * It calls the resize method of each block instance.
   * @returns {void}
   */
  resize() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].instances.length; j++) {
        this.blocks[i].instances[j].class.resize()
      }
    }
  }

  /**
   * Called when the window is scrolled.
   * It calls the scroll method of the parallax module if it exists and the scroll method of each block instance.
   * @param {Event} e - The scroll event.
   * @returns {void}
   */
  scroll(e) {
    store.modules.parallax && store.modules.parallax.scroll(e)

    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = 0; j < this.blocks[i].instances.length; j++) {
        this.blocks[i].instances[j].class.scroll(e)
      }
    }
  }

  // Useful with LocomotiveScroll
  // inView(value, way, object) {
  //   for (let i = 0; i < this.blocks.length; i++) {
  //     for (let j = 0; j < this.blocks[i].instances.length; j++) {
  //       if (this.blocks[i].instances[j].el === object.el) this.blocks[i].instances[j].class.inView(value, way, object)
  //     }
  //   }
  // }

  /**
   * Called in each animation frame.
   * It calls the update method of each block instance that is in view.
   * @returns {void}
   */
  loop() {
    if (this.blocks) {
      for (let i = 0; i < this.blocks.length; i++) {
        for (let j = 0; j < this.blocks[i].instances.length; j++) {
          this.blocks[i].instances[j].class.isInView && this.blocks[i].instances[j].class.update()
        }
      }
    }
  }
}
