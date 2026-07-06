/* Campo de curvas topográficas ORIGINAL de SmartGym.
   Adaptación del principio (fondo de líneas de nivel + parallax de cursor)
   observado en referencias editoriales; los trazados son propios, dibujados
   para este proyecto. Dos grupos (.contour-a / .contour-b) permiten parallax
   diferencial con GSAP. Decorativo: aria-hidden y pointer-events none. */

export function ContourField({ tone = 'default' }: { tone?: 'default' | 'inverse' }) {
  const stroke = tone === 'inverse' ? 'rgba(255, 247, 248, 0.16)' : 'var(--sg-border)'
  return (
    <svg
      className="sg-contours"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      fill="none"
      stroke={stroke}
      strokeWidth="1.1"
    >
      <g className="contour-a">
        <path d="M-80 780 C 180 620, 240 380, 170 210 C 120 90, 220 -40, 420 -60" />
        <path d="M-40 860 C 260 680, 340 420, 250 220 C 190 80, 320 -60, 540 -80" />
        <path d="M40 940 C 360 740, 450 460, 340 230 C 270 70, 430 -80, 670 -100" />
        <path d="M1180 980 C 1080 760, 1150 600, 1330 520 C 1470 460, 1500 320, 1420 180" />
        <path d="M1300 1000 C 1200 780, 1280 640, 1440 570" />
      </g>
      <g className="contour-b">
        <path d="M520 960 C 600 700, 500 560, 640 420 C 780 280, 720 120, 840 -40" />
        <path d="M640 980 C 720 720, 620 580, 760 440 C 900 300, 840 140, 960 -20" />
        <path d="M760 1000 C 840 740, 740 600, 880 460 C 1020 320, 960 160, 1080 0" />
        <path d="M-60 260 C 140 300, 300 240, 380 120" />
      </g>
    </svg>
  )
}
