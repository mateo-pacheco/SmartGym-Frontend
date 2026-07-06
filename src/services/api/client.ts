/* Cliente API de SmartGym.
   Regla (AGENTS.md §16): no se inventan endpoints, campos ni datos.
   Mientras el backend no publique un contrato confirmado (OpenAPI/tipos),
   la app declara explícitamente el estado "sin contrato". */

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
