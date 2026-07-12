import type { ImgHTMLAttributes } from 'react'

interface ResponsivePictureProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  stem: string
}

export function ResponsivePicture({ stem, alt, sizes = '100vw', ...rest }: ResponsivePictureProps) {
  return (
    <img
      src={`/media/${stem}-1600.webp`}
      srcSet={`/media/${stem}-960.webp 960w, /media/${stem}-1600.webp 1600w, /media/${stem}-2400.webp 2400w`}
      sizes={sizes}
      alt={alt}
      {...rest}
    />
  )
}
