import App from './App'
import store from './util/store'

if (store.debug) {
  import('./util/Grid').then(({ default: Grid }) => {
    store.modules.grid = new Grid()
  })
}

if (!store.detect.isMobile) {
  import('./util/Parallax').then(({ default: Parallax }) => {
    store.modules.parallax = new Parallax()
  })
}

window.addEventListener('load', () => {
  // eslint-disable-next-line no-new
  new App()
})
