/* Cliente API de SmartGym.
   El contrato del backend está CONFIRMADO en `openapi.yaml` (SmartGym API
   v1.0.0): tipos en ./types.ts, transporte en ./http.ts y funciones por
   módulo en ./endpoints.ts. La conexión, sin embargo, sigue siendo opcional:
   sin VITE_SMARTGYM_API_URL la app declara el estado "sin conexión" y no
   inventa datos (AGENTS.md §16). */

export type ContractStatus = 'sin-contrato' | 'configurado'

export interface ApiConfig {
  status: ContractStatus
  baseUrl?: string
}

export function getApiConfig(): ApiConfig {
  const baseUrl = import.meta.env.VITE_SMARTGYM_API_URL as string | undefined
  if (!baseUrl) {
    return { status: 'sin-contrato' }
  }
  return { status: 'configurado', baseUrl }
}
