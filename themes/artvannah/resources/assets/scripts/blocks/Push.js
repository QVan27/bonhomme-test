import Block from './Block'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default class Push extends Block {
  onEnterCompleted() {
    this.animate()
  }

  getElems() {
    this.$bg = this.el.querySelector('.b-push__bg')
    this.$content = this.el.querySelector('.b-push__content')
  }

  /**
   * Configure et exécute les animations sur les éléments sélectionnés en utilisant GSAP.
   * Les animations sont liées au défilement de la page grâce à ScrollTrigger.
   *
   * @returns {void}
   */
  animate() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.el,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: true
      }
    })

    tl
      .fromTo(this.$bg, {
        top: '-10rem'
      }, {
        top: '0'
      })
      .fromTo(this.$content, {
        opacity: 0
      }, {
        opacity: 1
      }, 0)
  }
}
