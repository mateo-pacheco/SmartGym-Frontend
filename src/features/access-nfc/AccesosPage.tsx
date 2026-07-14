import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { Tabs } from '../../components/navigation/Tabs'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { ApiState } from '../../components/feedback/ApiState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { SearchField } from '../../components/forms/SearchField'
import { FormModal, type ValoresForm } from '../../components/forms/FormModal'
import { RegistrarManillaModal } from './RegistrarManillaModal'
import { useToast } from '../../app/providers/useToast'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { useMutation } from '../../services/api/useMutation'
import { accesosNfc, manillasNfc } from '../../services/api/endpoints'
import { estadoVisual } from '../../lib/estadoVisual'
import { ESTADO_MANILLA } from '../../lib/opcionesContrato'
import type { ManillaNfcResponseDTO } from '../../services/api/types'

const fecha = (iso: string) => new Date(iso).toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' })

export default function AccesosPage() {
  const { esAdministrador, id: sesionId } = useAuth()
  const { showToast } = useToast()

  const accesos = useApiData(() => accesosNfc.consultar({ size: 50 }))
  const intentos = useApiData(() => accesosNfc.intentosFallidos({ size: 50 }))
  const auditorias = useApiData(() => accesosNfc.auditoriasManillas({ size: 50 }))

  const [registrar, setRegistrar] = useState(false)
  const [busquedaDep, setBusquedaDep] = useState(sesionId ?? '')
  const [depConsultado, setDepConsultado] = useState('')
  const [manillas, setManillas] = useState<ManillaNfcResponseDTO[]>([])
  const [accion, setAccion] = useState<{ tipo: 'bloquear' | 'reponer'; manilla: ManillaNfcResponseDTO } | null>(null)

  const historial = useMutation((deportistaId: string) => manillasNfc.historialPorDeportista(deportistaId, { size: 50 }))
  const bloquear = useMutation((id: string, body: Parameters<typeof manillasNfc.bloquear>[1]) => manillasNfc.bloquear(id, body))
  const reponer = useMutation((id: string, body: Parameters<typeof manillasNfc.reponer>[1]) => manillasNfc.reponer(id, body))

  const cargarManillas = async (deportistaId: string) => {
    const dep = deportistaId.trim()
    if (!dep) return
    try {
      const page = await historial.ejecutar(dep)
      setManillas(page?.content ?? [])
      setDepConsultado(dep)
    } catch {
      setManillas([])
    }
  }

  const enviarAccion = async (v: ValoresForm) => {
    if (!accion) return
    try {
      if (accion.tipo === 'bloquear') {
        await bloquear.ejecutar(accion.manilla.id, {
          estadoNuevo: v.estadoNuevo as never,
          actorTipo: v.actorTipo,
          motivo: v.motivo,
          actorId: sesionId ?? undefined,
        })
        showToast({ title: 'Manilla bloqueada', body: 'El estado se actualizó en el backend.' })
      } else {
        await reponer.ejecutar(accion.manilla.id, {
          codigoNfc: v.codigoNfc,
          estadoBloqueo: (v.estadoBloqueo || undefined) as never,
          actorTipo: v.actorTipo,
          motivo: v.motivo || undefined,
          actorId: sesionId ?? undefined,
        })
        showToast({ title: 'Manilla repuesta', body: 'La reposición se registró en el backend.' })
      }
      setAccion(null)
      cargarManillas(depConsultado)
    } catch {
      /* error reflejado en el formulario */
    }
  }

  const tabAccesos = (
    <>
      <ApiState estado={accesos.estado} contract="Accesos NFC" error={accesos.error} onRetry={accesos.recargar} />
      {accesos.datos ? (
        <p className="sg-note--muted mb-2">{accesos.datos.totalElements} accesos registrados</p>
      ) : null}
      <DataTable
        caption="Últimos accesos NFC validados por el servidor"
        columns={[
          { key: 'deportista', header: 'Deportista' },
          { key: 'maquina', header: 'Máquina' },
          { key: 'resultado', header: 'Resultado' },
          { key: 'fecha', header: 'Fecha y hora' },
          { key: 'latencia', header: 'Latencia', align: 'end' },
        ]}
        rows={(accesos.datos?.content ?? []).map((a) => ({
          deportista: a.deportistaId,
          maquina: a.maquinaId,
          resultado: a.resultado === 'EXITOSO'
            ? <StatusBadge tone="success" label="Exitoso" icon="check" />
            : <StatusBadge tone="danger" label="Fallido" />,
          fecha: fecha(a.fechaHoraServidor),
          latencia: `${a.tiempoRespuestaMs} ms`,
        }))}
        emptyState={<NoContractState illustration="nfc" title="Sin accesos registrados" body="Los accesos aparecerán aquí cuando una manilla sea validada." />}
      />
    </>
  )

  const tabManillas = (
    <div className="d-grid gap-3">
      <div className="d-flex flex-wrap gap-2 align-items-end justify-content-between">
        <div style={{ minWidth: 260 }}>
          <span className="sg-field-label d-block">Historial por deportista</span>
          <SearchField
            id="buscar-manillas-deportista"
            label="UUID del deportista"
            placeholder="UUID del deportista"
            value={busquedaDep}
            onChange={setBusquedaDep}
          />
        </div>
        <div className="d-flex gap-2">
          <AppButton variant="secondary" onClick={() => cargarManillas(busquedaDep)} disabled={historial.enviando || !busquedaDep.trim()}>
            {historial.enviando ? 'Consultando…' : 'Consultar manillas'}
          </AppButton>
          {esAdministrador ? (
            <AppButton icon="mas" onClick={() => setRegistrar(true)}>Registrar manilla</AppButton>
          ) : null}
        </div>
      </div>
      {historial.error ? <p className="sg-form-note text-danger m-0" role="alert">{historial.error}</p> : null}

      <DataTable
        caption="Manillas del deportista consultado. El código NFC nunca se muestra completo."
        columns={[
          { key: 'identificador', header: 'Identificador' },
          { key: 'estado', header: 'Estado' },
          { key: 'asignacion', header: 'Asignación' },
          { key: 'acciones', header: '', align: 'end' },
        ]}
        rows={manillas.map((m) => ({
          identificador: m.codigoNfcMascara,
          estado: <StatusBadge tone={estadoVisual(m.estado).tono} label={estadoVisual(m.estado).etiqueta} />,
          asignacion: fecha(m.fechaAsignacion),
          acciones: esAdministrador ? (
            <span className="d-inline-flex gap-1 justify-content-end">
              <AppButton variant="ghost" size="sm" onClick={() => setAccion({ tipo: 'bloquear', manilla: m })}>Bloquear</AppButton>
              <AppButton variant="ghost" size="sm" onClick={() => setAccion({ tipo: 'reponer', manilla: m })}>Reponer</AppButton>
            </span>
          ) : <span className="sg-note--muted">—</span>,
        }))}
        emptyState={<NoContractState illustration="nfc" title={depConsultado ? 'Sin manillas para este deportista' : 'Consulta un deportista'} body={depConsultado ? 'El deportista consultado no tiene manillas registradas.' : 'Escribe un UUID y pulsa «Consultar manillas».'} />}
      />
    </div>
  )

  const tabIntentos = (
    <>
      <ApiState estado={intentos.estado} contract="Intentos fallidos de acceso" error={intentos.error} onRetry={intentos.recargar} />
      <DataTable
        caption="Intentos de acceso fallidos con su motivo"
        columns={[
          { key: 'maquina', header: 'Máquina' },
          { key: 'gateway', header: 'Gateway' },
          { key: 'motivo', header: 'Motivo' },
          { key: 'fecha', header: 'Fecha y hora', align: 'end' },
        ]}
        rows={(intentos.datos?.content ?? []).map((i) => ({
          maquina: i.maquinaId,
          gateway: i.gatewayId,
          motivo: <StatusBadge tone="danger" label={estadoVisual(i.motivo).etiqueta} />,
          fecha: fecha(i.fechaHoraServidor),
        }))}
        emptyState={<NoContractState illustration="nfc" title="Sin intentos fallidos" body="No se han registrado intentos de acceso fallidos." />}
      />
    </>
  )

  const tabAuditorias = (
    <>
      <ApiState estado={auditorias.estado} contract="Auditoría de manillas" error={auditorias.error} onRetry={auditorias.recargar} />
      <DataTable
        caption="Auditoría de acciones sobre manillas"
        columns={[
          { key: 'accion', header: 'Acción' },
          { key: 'actor', header: 'Actor' },
          { key: 'transicion', header: 'Transición' },
          { key: 'fecha', header: 'Fecha y hora', align: 'end' },
        ]}
        rows={(auditorias.datos?.content ?? []).map((a) => ({
          accion: estadoVisual(a.accion).etiqueta,
          actor: a.actorTipo,
          transicion: `${estadoVisual(a.estadoAnterior).etiqueta} → ${estadoVisual(a.estadoNuevo).etiqueta}`,
          fecha: fecha(a.fechaHora),
        }))}
        emptyState={<NoContractState illustration="auditoria" title="Sin auditorías" body="Las acciones sobre manillas quedarán registradas aquí." />}
      />
    </>
  )

  return (
    <>
      <PageHeader
        title="Acceso NFC"
        lead="Accesos validados, manillas por deportista, intentos fallidos y auditoría del ecosistema NFC."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Operación' },
          { label: 'Acceso NFC' },
        ]}
      />

      <Tabs
        tabs={[
          { id: 'accesos', label: 'Accesos', content: tabAccesos },
          { id: 'manillas', label: 'Manillas', content: tabManillas },
          { id: 'intentos', label: 'Intentos fallidos', content: tabIntentos },
          { id: 'auditorias', label: 'Auditoría', content: tabAuditorias },
        ]}
      />

      <RegistrarManillaModal
        show={registrar}
        onHide={() => setRegistrar(false)}
        deportistaIds={depConsultado ? [depConsultado] : sesionId ? [sesionId] : []}
        onSaved={() => { setRegistrar(false); accesos.recargar(); if (depConsultado) cargarManillas(depConsultado) }}
      />

      <FormModal
        show={accion?.tipo === 'bloquear'}
        title="Bloquear manilla"
        submitLabel="Bloquear"
        enviando={bloquear.enviando}
        error={bloquear.error}
        onHide={() => setAccion(null)}
        onSubmit={enviarAccion}
        campos={[
          { key: 'estadoNuevo', label: 'Nuevo estado', tipo: 'select', requerido: true, opciones: ESTADO_MANILLA.filter((o) => o.value !== 'ACTIVA') },
          { key: 'actorTipo', label: 'Tipo de actor', tipo: 'text', requerido: true, placeholder: 'ADMIN, GUARDIA…' },
          { key: 'motivo', label: 'Motivo', tipo: 'textarea', requerido: true },
        ]}
      />

      <FormModal
        show={accion?.tipo === 'reponer'}
        title="Reponer manilla"
        submitLabel="Reponer"
        enviando={reponer.enviando}
        error={reponer.error}
        onHide={() => setAccion(null)}
        onSubmit={enviarAccion}
        campos={[
          { key: 'codigoNfc', label: 'Nuevo código NFC', tipo: 'text', requerido: true, ayuda: 'El backend guarda su HMAC; nunca se muestra completo.' },
          { key: 'estadoBloqueo', label: 'Estado de bloqueo previo', tipo: 'select', opciones: ESTADO_MANILLA },
          { key: 'actorTipo', label: 'Tipo de actor', tipo: 'text', requerido: true, placeholder: 'ADMIN, GUARDIA…' },
          { key: 'motivo', label: 'Motivo', tipo: 'textarea' },
        ]}
      />
    </>
  )
}
