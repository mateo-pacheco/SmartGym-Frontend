import { useState, type ReactNode } from 'react'
import { DataTable, type DataTableColumn } from './DataTable'
import { NoContractState } from '../feedback/NoContractState'
import { ApiState } from '../feedback/ApiState'
import { AppButton } from '../actions/AppButton'
import { BotonesReporte } from '../actions/BotonesReporte'
import { FormModal, type CampoDef, type ValoresForm } from '../forms/FormModal'
import { ConfirmDialog } from '../feedback/ConfirmDialog'
import type { IllustrationName } from '../illustrations/EmptyIllustration'
import { useToast } from '../../app/providers/useToast'
import { useMutation } from '../../services/api/useMutation'
import type { ApiData } from '../../services/api/useApiData'

export interface CrudSectionProps<T> {
  titulo: string
  /** Nombre singular de la entidad, para mensajes ("Se eliminó el alimento"). */
  entidad: string
  datos: ApiData<T[]>
  columnas: DataTableColumn[]
  /** Celdas de datos de cada fila (sin la columna de acciones). */
  fila: (item: T) => Record<string, ReactNode>
  idDe: (item: T) => string
  /** Gate de rol: si es false, se ocultan crear/editar/eliminar. */
  puedeGestionar: boolean
  campos: CampoDef[]
  /** Valores iniciales al editar un registro (si se permite editar). */
  aValores?: (item: T) => ValoresForm
  crear?: (v: ValoresForm) => Promise<unknown>
  actualizar?: (id: string, v: ValoresForm) => Promise<unknown>
  eliminar?: (id: string) => Promise<unknown>
  etiquetaCrear?: string
  illustration: IllustrationName
  emptyTitle: string
  emptyBody: string
  /** Elemento extra a la derecha del encabezado (filtros, etc.). */
  extraHeader?: ReactNode
  /** Exportación del módulo (endpoints /reportes/pdf y /reportes/excel). */
  reporte?: {
    pdf: () => Promise<void>
    excel: () => Promise<void>
    /** Gate de rol para exportar; por defecto, quien puede ver puede exportar. */
    permitido?: boolean
  }
  pageSize?: number
}

export function CrudSection<T>({
  titulo,
  entidad,
  datos,
  columnas,
  fila,
  idDe,
  puedeGestionar,
  campos,
  aValores,
  crear,
  actualizar,
  eliminar,
  etiquetaCrear,
  illustration,
  emptyTitle,
  emptyBody,
  extraHeader,
  reporte,
  pageSize,
}: CrudSectionProps<T>) {
  const { showToast } = useToast()
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState<T | null>(null)
  const [aEliminar, setAEliminar] = useState<T | null>(null)

  const mutCrear = useMutation((v: ValoresForm) => crear!(v))
  const mutActualizar = useMutation((id: string, v: ValoresForm) => actualizar!(id, v))
  const mutEliminar = useMutation((id: string) => eliminar!(id))

  const gestionable = puedeGestionar && (!!crear || !!actualizar || !!eliminar)
  const conAcciones = puedeGestionar && (!!actualizar || !!eliminar)

  const abrirCrear = () => {
    setEditando(null)
    mutCrear.limpiarError()
    setFormAbierto(true)
  }
  const abrirEditar = (item: T) => {
    setEditando(item)
    mutActualizar.limpiarError()
    setFormAbierto(true)
  }

  const enviar = async (v: ValoresForm) => {
    try {
      if (editando && actualizar) {
        await mutActualizar.ejecutar(idDe(editando), v)
        showToast({ title: `${entidad} actualizado`, body: 'Los cambios se guardaron en el backend.' })
      } else if (crear) {
        await mutCrear.ejecutar(v)
        showToast({ title: `${entidad} creado`, body: 'El registro se guardó en el backend.' })
      }
      setFormAbierto(false)
      setEditando(null)
      datos.recargar()
    } catch {
      /* el error queda en la mutación y se muestra en el formulario */
    }
  }

  const confirmarEliminar = async () => {
    if (!aEliminar || !eliminar) return
    try {
      await mutEliminar.ejecutar(idDe(aEliminar))
      showToast({ title: `${entidad} eliminado`, body: 'El registro se eliminó en el backend.' })
      setAEliminar(null)
      datos.recargar()
    } catch {
      /* error mostrado abajo */
    }
  }

  const lista = datos.datos ?? []
  const filas = lista.map((item) => {
    const base = fila(item)
    if (!conAcciones) return base
    return {
      ...base,
      __acciones: (
        <span className="d-inline-flex gap-1 justify-content-end">
          {actualizar ? (
            <AppButton variant="ghost" size="sm" icon="editar" onClick={() => abrirEditar(item)} aria-label={`Editar ${entidad}`} />
          ) : null}
          {eliminar ? (
            <AppButton variant="ghost" size="sm" icon="basura" onClick={() => setAEliminar(item)} aria-label={`Eliminar ${entidad}`} />
          ) : null}
        </span>
      ),
    }
  })

  const columnasFinal = conAcciones
    ? [...columnas, { key: '__acciones', header: '', align: 'end' as const }]
    : columnas

  return (
    <section className="mb-2">
      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
        <h2 className="sg-section-title m-0">{titulo}</h2>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {extraHeader}
          {reporte ? (
            <BotonesReporte
              pdf={reporte.pdf}
              excel={reporte.excel}
              permitido={reporte.permitido ?? true}
              disabled={datos.estado !== 'listo'}
            />
          ) : null}
          {gestionable && crear ? (
            <AppButton size="sm" icon="mas" onClick={abrirCrear} disabled={datos.estado !== 'listo'}>
              {etiquetaCrear ?? `Nuevo ${entidad.toLowerCase()}`}
            </AppButton>
          ) : null}
        </div>
      </div>

      <ApiState estado={datos.estado} contract={titulo} error={datos.error} onRetry={datos.recargar} />

      <DataTable
        caption={titulo}
        columns={columnasFinal}
        rows={filas}
        pageSize={pageSize}
        loading={datos.estado === 'cargando' ? <p className="sg-note--muted p-3 m-0">Cargando…</p> : undefined}
        emptyState={
          <NoContractState illustration={illustration} title={emptyTitle} body={emptyBody} />
        }
      />

      <FormModal
        show={formAbierto}
        title={editando ? `Editar ${entidad.toLowerCase()}` : `Nuevo ${entidad.toLowerCase()}`}
        submitLabel={editando ? 'Guardar cambios' : 'Crear'}
        campos={campos}
        valorInicial={editando && aValores ? aValores(editando) : undefined}
        enviando={mutCrear.enviando || mutActualizar.enviando}
        error={editando ? mutActualizar.error : mutCrear.error}
        onHide={() => {
          setFormAbierto(false)
          setEditando(null)
        }}
        onSubmit={enviar}
      />

      <ConfirmDialog
        show={!!aEliminar}
        title={`Eliminar ${entidad.toLowerCase()}`}
        body={<>Esta acción elimina el registro en el backend y no se puede deshacer.{mutEliminar.error ? <span className="text-danger d-block mt-2">{mutEliminar.error}</span> : null}</>}
        confirmLabel="Eliminar"
        danger
        busy={mutEliminar.enviando}
        onConfirm={confirmarEliminar}
        onCancel={() => setAEliminar(null)}
      />
    </section>
  )
}
