import '@testing-library/jest-dom'

/* jsdom no implementa matchMedia; GSAP matchMedia y el ThemeProvider lo usan. */
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

/* jsdom no implementa IntersectionObserver; motion/react (useInView en
   MotionEffect de Animate UI) lo necesita. */
if (!('IntersectionObserver' in window)) {
  class IntersectionObserverStub {
    root = null
    rootMargin = ''
    thresholds = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: IntersectionObserverStub,
  })
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    value: IntersectionObserverStub,
  })
}
