import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Registro único de plugins GSAP para toda la aplicación. */
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
