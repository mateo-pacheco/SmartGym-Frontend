/* Configuración en dos capas:
   1. Runtime: `window.__APP_CONFIG__`, generado por el contenedor Docker desde
      variables de entorno al arrancar (permite que una misma imagen sirva en
      cualquier entorno sin reconstruirse).
   2. Build: variables de Vite (`import.meta.env`), usadas en desarrollo con
      `.env.local`.
   Se prefiere el runtime; si está vacío o es un placeholder sin sustituir,
   cae al valor de build. */

interface RuntimeConfig {
  VITE_SMARTGYM_API_URL?: string
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

type RuntimeKey = keyof RuntimeConfig

const runtime: RuntimeConfig =
  (typeof window !== 'undefined' &&
    (window as unknown as { __APP_CONFIG__?: RuntimeConfig }).__APP_CONFIG__) ||
  {}

/* Acceso estático para que Vite reemplace cada variable en el build. */
const built: RuntimeConfig = {
  VITE_SMARTGYM_API_URL: import.meta.env.VITE_SMARTGYM_API_URL as string | undefined,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
}

function read(key: RuntimeKey): string | undefined {
  const injected = runtime[key]
  if (typeof injected === 'string' && injected.trim() && !injected.startsWith('${')) {
    return injected
  }
  const value = built[key]
  return value && value.trim() ? value : undefined
}

export const runtimeEnv = {
  get apiUrl() {
    return read('VITE_SMARTGYM_API_URL')
  },
  get supabaseUrl() {
    return read('VITE_SUPABASE_URL')
  },
  get supabaseAnonKey() {
    return read('VITE_SUPABASE_ANON_KEY')
  },
}
