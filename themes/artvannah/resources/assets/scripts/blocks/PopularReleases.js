import Block from './Block'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/dist/Draggable'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(Draggable, ScrollTrigger)

export default class PopularReleases extends Block {

  /**
   * Initialise le carrousel et configure le déclencheur de défilement.
   *
   * @returns {void}
   */
  onEnterCompleted() {
    this.initCarousel()
    this.setupScrollTrigger()
  }

  bindMethods() {
    this.updateProgress = this.updateProgress.bind(this)
  }

  getElems() {
    this.$wrapper = this.el.querySelector('.b-popular-releases__slider-wrapper')
    this.$slides = this.el.querySelectorAll('.b-popular-releases__slider-slide')
  }

  /**
   * Initialise le carrousel en configurant les animations GSAP et le comportement draggable.
   *
   * @link https://codepen.io/osublake/pen/MWwOjrm/1e13ae4d1583c9a7157b46b995345872?editors=1010
   * @returns {void}
   */
  initCarousel() {
    // Calcul des dimensions et création d'un proxy pour le drag
    const boxWidth = this.$slides[0].offsetWidth + 20
    const wrapWidth = this.$slides.length * boxWidth
    const proxy = document.createElement('div')
  
    // Configuration initiale des éléments
    gsap.set(this.$wrapper, { height: 450 })
  
    this.$slides.forEach((box, i) => {
      gsap.set(box, {
        x: i * boxWidth,
        left: -boxWidth
      })
    })
  
    // Animation principale
    this.animation = gsap.to(this.$slides, {
      duration: 1,
      x: '+=' + wrapWidth,
      ease: 'linear',
      paused: true,
      repeat: -1,
      modifiers: {
        x: (xValue) => {
          const newX = parseFloat(xValue) % wrapWidth

          return newX + 'px'
        }
      }
    }).progress(1 / this.$slides.length)
  
    // Gestion du drag avec mise à jour de la progression
    let lastDragX = 0
    let velocityX = 0
  
    Draggable.create(proxy, {
      type: 'x',
      trigger: this.$wrapper,
      onPress: () => {
        startDragX = this.x
        lastDragX = this.x
      },
      onDrag: () => {
        const currentX = gsap.getProperty(proxy, 'x')

        velocityX = currentX - lastDragX
        lastDragX = currentX

        this.updateProgress()
      },
      onRelease: () => {
        const inertiaDuration = Math.abs(velocityX) * 0.02

        gsap.to(proxy, {
          x: `+=${velocityX * 10}`,
          duration: inertiaDuration,
          ease: 'power3.out',
          onUpdate: this.updateProgress
        })
      }
    })
  
    // Stockage des références pour utilisation ultérieure
    this.proxy = proxy
    this.boxWidth = boxWidth
    this.wrapWidth = wrapWidth
  }

  /**
   * Configure ScrollTrigger pour intégrer le carrousel au défilement de la page.
   *
   * @returns {void}
   */
  setupScrollTrigger() {
    ScrollTrigger.create({
      trigger: this.$wrapper,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const deltaX = self.getVelocity() / 100

        gsap.to(this.proxy, {
          x: `-=${deltaX}`,
          duration: 0.1,
          onUpdate: this.updateProgress
        })
      }
    })
  }

  /**
   * Met à jour la progression de l'animation du carrousel en fonction de la position du proxy.
   *
   * @returns {void}
   */
  updateProgress() {
    const wrapProgress = gsap.utils.wrap(0, 1)
    const props = gsap.getProperty(this.proxy)

    this.animation.progress(wrapProgress(props('x') / this.wrapWidth))
  }

  resize() {
    this.initCarousel()
    ScrollTrigger.refresh()
  }
}
