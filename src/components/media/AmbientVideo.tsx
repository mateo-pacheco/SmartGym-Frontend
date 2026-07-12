import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ResponsivePicture } from './ResponsivePicture'

interface AmbientVideoProps {
  desktopSrc: string
  mobileSrc: string
  posterStem: string
  className?: string
  priority?: boolean
}

export function AmbientVideo({
  desktopSrc,
  mobileSrc,
  posterStem,
  className = '',
  priority = false,
}: AmbientVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduceMotion || typeof IntersectionObserver === 'undefined') return

    const play = () => {
      if (video.readyState === 0) video.load()
      // jsdom devuelve undefined en play(); en navegadores es una promesa.
      void video.play()?.catch(() => {})
    }

    if (priority) play()

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else video.pause()
      },
      { rootMargin: '180px 0px', threshold: 0.08 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [priority, reduceMotion])

  return (
    <motion.div
      className={`sg-ambient-video ${className}`.trim()}
      initial={false}
      animate={{ opacity: 1 }}
    >
      {reduceMotion ? (
        <ResponsivePicture
          stem={posterStem}
          alt=""
          sizes="100vw"
          width={1600}
          height={904}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload={priority ? 'auto' : 'none'}
          poster={`/media/${posterStem}-1600.webp`}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={mobileSrc} type="video/mp4" media="(max-width: 767px)" />
          <source src={desktopSrc} type="video/mp4" />
        </video>
      )}
    </motion.div>
  )
}
