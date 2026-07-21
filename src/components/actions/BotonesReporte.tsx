import { AppButton } from './AppButton'
import { useMutation } from '../../services/api/useMutation'
import { useAuth } from '../../services/api/useAuth'

/* Roles con permiso de exportación. Los reportes vuelcan datos del ecosistema
   (accesos, telemetría, alertas, planes de terceros), así que el rol
   ESTUDIANTE queda fuera por mínimo privilegio. El backend debe aplicar el
   mismo gate: ocultar el botón no autoriza nada por sí solo. */
const ROLES_EXPORTACION = ['ADMINISTRADOR', 'MEDICO', 'ENTRENADOR'] as const

export interface BotonesReporteProps {
  /** Descarga el reporte PDF del módulo (endpoint real del contrato). */
  pdf: () => Promise<void>
  /** Descarga el reporte Excel del módulo. */
  excel: () => Promise<void>
  /** Restricción adicional del módulo; nunca amplía el permiso por rol. */
  permitido?: boolean
  /** Deshabilita mientras no haya datos o parámetros requeridos. */
  disabled?: boolean
}

/* Par de botones de exportación (PDF / Excel) para un módulo.
   Cada botón llama al endpoint real; el archivo lo entrega el backend con su
   Content-Disposition. Previene doble envío y muestra el error mapeado. */
export function BotonesReporte({ pdf, excel, permitido = true, disabled = false }: BotonesReporteProps) {
  const descargaPdf = useMutation(pdf)
  const descargaExcel = useMutation(excel)
  const { tieneRol } = useAuth()

  if (!permitido || !tieneRol(...ROLES_EXPORTACION)) return null

  const ocupado = descargaPdf.enviando || descargaExcel.enviando
  const error = descargaPdf.error ?? descargaExcel.error

  const lanzar = (fn: () => Promise<unknown>) => () => {
    void fn().catch(() => {
      /* el error queda en el estado de la mutación */
    })
  }

  return (
    <div className="sg-reportes d-flex flex-column align-items-end gap-1">
      <div className="d-flex flex-wrap gap-2">
        <AppButton
          variant="secondary"
          size="sm"
          icon="exportar"
          onClick={lanzar(descargaPdf.ejecutar)}
          disabled={disabled || ocupado}
        >
          {descargaPdf.enviando ? 'Generando…' : 'PDF'}
        </AppButton>
        <AppButton
          variant="secondary"
          size="sm"
          icon="exportar"
          onClick={lanzar(descargaExcel.ejecutar)}
          disabled={disabled || ocupado}
        >
          {descargaExcel.enviando ? 'Generando…' : 'Excel'}
        </AppButton>
      </div>
      {error ? (
        <p className="sg-form-note text-danger m-0" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
