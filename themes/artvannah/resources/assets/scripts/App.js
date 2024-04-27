/* eslint-disable max-lines */
import 'whatwg-fetch'
import 'intersection-observer'

import LazyLoad from 'vanilla-lazyload'
import { throttle, debounce } from 'throttle-debounce'

// Utils
import Loader from './util/Loader'
import Menu from './util/Menu'
import Anchor from './util/Anchor'
import store from './util/store'
import Observer from './util/Observer'
import locomotiveScroll from 'locomotive-scroll'
import Lenis from '@studio-freight/lenis'

// Renderer
import Page from './routes/Page'

// Transitions
import * as Taxi from '@unseenco/taxi'
import Fade from './transitions/Fade'

/**
 * Main application class
 * @module App
 */
export default class App {

  /**
   * Constructor for the App class.
   * @constructor
   */
  constructor() {

    /**
     * Binding the context of `this` to the resize, scroll, and update methods.
     */
    this.resize = this.resize.bind(this)
    this.scroll = this.scroll.bind(this)
    this.update = this.update.bind(this)

    /**
     * Request Animation Frame ID, initially set to null.
     * @type {number|null}
     */
    this.raf = null

    /**
     * Debounced and throttled versions of the resize method to control the rate at which it's invoked.
     * Debounced version will delay invoking resize until after 100 milliseconds have passed since the last time it was invoked.
     * Throttled version will invoke resize at most once every 150 milliseconds.
     */
    this.resizeDebounced = debounce(100, this.resize)
    this.resizeThrottled = throttle(150, this.resize)

    /**
     * If no scroll engine is set in the store, create debounced and throttled versions of the scroll method.
     * Debounced version will delay invoking scroll until after 100 milliseconds have passed since the last time it was invoked.
     * Throttled version will invoke scroll at most once every 50 milliseconds.
     */
    if (!store.scrollEngine) {
      this.scrollDebounced = debounce(100, this.scroll)
      this.scrollThrottled = throttle(50, this.scroll)
    }

    /**
     * Setting the window dimensions and device pixel ratio in the store.
     * Width and height are set to the inner width and height of the window.
     * Pixel ratio is set to the minimum of the device's pixel ratio and 2.
     */
    store.w = {
      w: window.innerWidth,
      h: window.innerHeight,
      pR: Math.min(window.devicePixelRatio, 2)
    }

    /**
     * Start the application.
     */
    this.start()
  }

  /**
   * Starts the application.
   * @method
   * @returns {Promise} A promise that resolves when the current renderer is set.
   */
  start() {

    /**
     * Initializes the appropriate scroll engine based on the value of `store.scrollEngine`.
     */
    if (store.scrollEngine === 'locomotive-scroll') this.initLocomotiveScroll()
    else if (store.scrollEngine === 'lenis') this.initLenis()
    else this.initObserver()

    /**
     * Initializes the Loader, Menu, Anchor, and LazyLoad utilities.
     */
    store.loader = new Loader()
    this.menu = new Menu()
    this.anchor = new Anchor()
    this.lazyLoad = new LazyLoad()

    /**
     * Initializes Taxi and sets up the event listeners, updates the application state,
     * disables the browser's default scroll restoration behavior, scrolls to the top of the window,
     * updates the smooth scroll if the scroll engine is Locomotive Scroll, and checks the anchor in the URL.
     */
    this.initTaxi().then(() => {
      this.events()
      this.update()

      if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

      window.scrollTo(0, 0)

      if (store.scrollEngine === 'locomotive-scroll') store.smoothScroll && store.smoothScroll.update()

      this.checkAnchor()
    })
  }

  /**
   * Initializes the Observer.
   * @method
   * @returns {void}
   */
  initObserver() {

    /**
     * Creates a new instance of Observer and assigns it to `store.observer`.
     */
    store.observer = new Observer()
  }

  /**
   * Initializes Locomotive Scroll.
   * @method
   * @returns {void}
   */
  initLocomotiveScroll() {

    /**
     * Creates a new instance of Locomotive Scroll and assigns it to `store.smoothScroll`.
     * The instance is configured to be smooth and passive, with an inertia of 1.0.
     * The scroll container is the first element in the document body with the class 'js-scroll'.
     */
    /* eslint-disable-next-line */
    store.smoothScroll = new locomotiveScroll({
      el: document.body.querySelector('.js-scroll'),
      smooth: true,
      passive: true,
      inertia: 1.0
    })
  }

  /**
   * Initializes Lenis.
   * @method
   * @returns {void}
   */
  initLenis() {

    /**
     * Creates a new instance of Lenis and assigns it to `store.smoothScroll`.
     * The instance is configured to be smooth, with a lerp of 0.08 and a vertical direction.
     * The 'lenis' class is added to the document element.
     * The Observer is also initialized.
     */
    store.smoothScroll = new Lenis({
      lerp: 0.08,
      smooth: true,
      direction: 'vertical'
    })

    document.documentElement.classList.add('lenis')
    this.initObserver()
  }

  /**
   * Initializes Taxi, a library for managing page transitions.
   * @method
   * @returns {Promise} A promise that resolves when the current renderer is set.
   */
  initTaxi() {
    return new Promise((resolve) => {

      /**
       * Creates a new instance of Taxi.Core and assigns it to `store.router`.
       * The instance is configured with a default renderer of `Page`, a default transition of `Fade`,
       * and a set of links to be managed by Taxi, excluding certain types of links.
       */
      store.router = new Taxi.Core({
        renderers: { default: Page },
        transitions: { default: Fade },
        links: 'a:not([target]):not([href^=\\#]):not([href^="mailto:"]):not([href^="tel:"]):not([data-taxi-ignore]):not([href*="wp-admin"]):not(.ab-item):not([href*="wp-login.php?action=logout"])'
      })

      /**
       * Preloads the pages linked to by the managed links.
       */
      this.preload()

      /**
       * Sets the current renderer and resolves the promise when done.
       */
      this.setCurrentRenderer().then(resolve)
    })
  }

  /**
   * Preloads the pages linked to by the managed links.
   * @method
   * @returns {void}
   */
  preload() {

    /**
     * Selects all the managed links in the document body.
     */
    const links = document.body.querySelectorAll('a:not([target]):not([href^=\\#]):not([href^="mailto:"]):not([href^="tel:"]):not([data-taxi-ignore]):not([href*="wp-admin"]):not(.ab-item):not([href*="wp-login.php?action=logout"])')

    /**
     * For each link, if the link's href is not already in the router's cache, preloads the page linked to by the href.
     */
    for (let i = 0; i < links.length; i++) {
      !store.router.cache.has(links[i].href) && store.router.preload(links[i].href)
    }
  }

  /**
   * Sets the current renderer to the renderer of the current cache entry in the router.
   * @method
   * @returns {Promise} A promise that resolves with the current renderer.
   */
  setCurrentRenderer() {
    return new Promise((resolve) => {

      /**
       * Assigns the renderer of the current cache entry in the router to `this.currentRenderer`.
       */
      this.currentRenderer = store.router.currentCacheEntry.renderer
      resolve(this.currentRenderer)
    })
  }

  /**
   * Resizes the application.
   * @method
   * @returns {void}
   */
  resize() {

    /**
     * Updates the width, height, and pixel ratio in the store.
     */
    store.w = {
      w: window.innerWidth,
      h: window.innerHeight,
      pR: Math.min(window.devicePixelRatio, 2)
    }

    /**
     * Resizes the current renderer and the menu, if it exists.
     */
    this.currentRenderer.resize()
    this.menu && this.menu.resize()
  }

  /**
   * Handles the scroll event.
   * @method
   * @param {number} e - The scroll position.
   * @returns {void}
   */
  scroll(e) {

    /**
     * If the scroll engine is Lenis, updates the direction of the smooth scroll based on the old and new scroll positions.
     * Scrolls the current renderer and the menu, if it exists.
     * Updates the old scroll position.
     */
    store.scrollEngine === 'lenis' && (store.smoothScroll.direction = this.oldScroll <= e ? 1 : -1)
    this.currentRenderer.scroll(e)
    this.menu && this.menu.scroll()
    this.oldScroll = e
  }

  /**
   * Updates the application.
   * @method
   * @returns {void}
   */
  update() {

    /**
     * If the scroll engine is Lenis, updates the smooth scroll.
     * Loops the current renderer.
     * Requests the next animation frame and updates the application again.
     */
    store.scrollEngine === 'lenis' && store.smoothScroll.raf()
    this.currentRenderer.loop()
    requestAnimationFrame(this.update)
  }

  /**
   * Sets up the event listeners for the application.
   * @method
   * @returns {void}
   */
  events() {

    /**
     * If the device is mobile, adds an event listener for the orientationchange event.
     * Otherwise, adds event listeners for the resize event, both throttled and debounced.
     */
    if (store.detect.isMobile) window.addEventListener('orientationchange', this.resize)
    else {
      window.addEventListener('resize', this.resizeThrottled)
      window.addEventListener('resize', this.resizeDebounced)
    }

    /**
     * If the scroll engine is Locomotive Scroll, adds event listeners for the scroll and call events.
     * If the scroll engine is Lenis, adds an event listener for the scroll event.
     * Otherwise, adds event listeners for the scroll event, both throttled and debounced.
     */
    if (store.scrollEngine === 'locomotive-scroll') {
      store.smoothScroll && store.smoothScroll.on('scroll', this.scroll)
      store.smoothScroll.on('call', (value, way, object) => {
        this.currentRenderer.inView(value, way, object)
      })
    } else if (store.scrollEngine === 'lenis') {
      store.smoothScroll.on('scroll', ({ scroll }) => {
        this.scroll(scroll)
      })
    } else {
      window.addEventListener('scroll', this.scrollThrottled)
      window.addEventListener('scroll', this.scrollDebounced)
    }

    /**
     * Adds an event listener for the NAVIGATE_IN event.
     * When the event is fired, updates the current renderer, the document title, the lazy load, and the menu.
     */
    store.router.on('NAVIGATE_IN', ({ to }) => {
      this.currentRenderer = to.renderer
      document.title = to.page.title
      this.lazyLoad.update()
      this.menu.onPageChange(store.router.currentLocation.href)
    })

    /**
     * Adds an event listener for the NAVIGATE_END event.
     * When the event is fired, if Google Analytics is defined, updates the location, page, and title in Google Analytics and sends a pageview.
     * Also updates the menu and checks the anchor.
     */
    store.router.on('NAVIGATE_END', ({ to }) => {
      if (typeof ga !== 'undefined') {
        ga('set', 'location', to.page.URL);
        ga('set', 'page', store.router.targetLocation.pathname)
        ga('set', 'title', to.page.title)
        ga('send', 'pageview')
      }

      this.menu.onPageChange(location.href)

      this.checkAnchor(location)
    })
  }

  /**
   * Checks for an anchor in the provided location or in the URL and scrolls to it if it exists.
   * @method
   * @param {Object} location - The location object. If not provided, defaults to null.
   * @returns {void}
   */
  checkAnchor(location = null) {

    /**
     * Finds a class in the body that includes 'formsubmit'.
     */
    const bodyClassSubmit = Array.from(document.body.classList).find((elt) => elt.includes('formsubmit'))
    let anchor = null

    /**
     * If a location is provided and it has an anchor, sets the anchor to it.
     * Otherwise, if a 'formsubmit' class was found, checks for a validation or error message and sets the anchor to it.
     * If neither of the above conditions are met, checks the URL for an anchor and sets the anchor to it.
     */
    if (location && location.anchor) anchor = location.anchor
    else if (bodyClassSubmit) {
      const validate = document.querySelector('#gform_confirmation_message_' + bodyClassSubmit.split('-')[1])
      const error = document.querySelector('#gform_wrapper_' + bodyClassSubmit.split('-')[1])

      if (validate) anchor = 'gform_confirmation_message_' + bodyClassSubmit.split('-')[1]
      else if (error) anchor = 'gform_wrapper_' + bodyClassSubmit.split('-')[1]
    } else {
      const idx = window.location.href.indexOf('#')

      if (idx !== -1) anchor = window.location.href.substring(idx + 1)
    }

    /**
     * If an anchor was found, finds the corresponding element and scrolls to it.
     * If the scroll engine is Locomotive Scroll, also updates the scroll.
     * If the scroll engine is not defined, scrolls to the element using the window.scrollTo method.
     */
    if (anchor) {
      const el = document.querySelector('#' + anchor)

      if (el) {
        if (store.scrollEngine === 'locomotive-scroll') {
          store.smoothScroll.scrollTo(el)
          store.smoothScroll.update()
        } else if (store.scrollEngine === 'lenis') {
          store.smoothScroll.scrollTo(el)
        } else {
          const elRect = el.getBoundingClientRect()

          window.scrollTo(0, elRect.top)
        }
      }
    }
  }
}
