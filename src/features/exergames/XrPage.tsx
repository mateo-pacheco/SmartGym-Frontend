import { useState } from 'react'
import { PageHeader } from '../../components/navigation/PageHeader'
import { Tabs } from '../../components/navigation/Tabs'
import { CrudSection } from '../../components/data-display/CrudSection'
import { DataTable } from '../../components/data-display/DataTable'
import { NoContractState } from '../../components/feedback/NoContractState'
import { StatusBadge } from '../../components/data-display/StatusBadge'
import { AppButton } from '../../components/actions/AppButton'
import { SearchField } from '../../components/forms/SearchField'
import { FormModal, type ValoresForm } from '../../components/forms/FormModal'
import { useToast } from '../../app/providers/useToast'
import { useApiData } from '../../services/api/useApiData'
import { useAuth } from '../../services/api/useAuth'
import { useMutation } from '../../services/api/useMutation'
import { exergames } from '../../services/api/endpoints'
import { estadoVisual } from '../../lib/estadoVisual'
import { TIPO_JUEGO, CONEXION, TIPO_DESAFIO, ORIGEN_SESION } from '../../lib/opcionesContrato'
import type {
  DesafioRequestDTO,
  DesafioResponseDTO,
  EstacionXrRequestDTO,
  EstacionXrResponseDTO,
  ProtocoloSeguridadResponseDTO,
  PuntajeRankingResponseDTO,
  SesionExergameResponseDTO,
} from '../../services/api/types'

const fecha = (iso: string) => new Date(iso).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })

export default function XrPage() {
  const { id: sesionId, esAdministrador } = useAuth()
  const estaciones = useApiData(() => exergames.listarEstaciones())
  const desafios = useApiData(() => exergames.listarDesafios())

  const estacionesTab = (
    <CrudSection<EstacionXrResponseDTO>
      titulo="Estaciones XR"
      entidad="Estación"
      datos={estaciones}
      puedeGestionar={esAdministrador}
      illustration="plan"
      emptyTitle="Sin estaciones XR"
      emptyBody="Registra estaciones con su tipo de juego y estado de conexión."
      idDe={(e) => e.id}
      columnas={[
        { key: 'nombre', header: 'Estación' },
        { key: 'juego', header: 'Tipo de juego' },
        { key: 'estado', header: 'Conexión' },
      ]}
      fila={(e) => ({
        nombre: e.nombre,
        juego: estadoVisual(e.tipoJuego).etiqueta,
        estado: <StatusBadge tone={estadoVisual(e.estadoConexion).tono} label={estadoVisual(e.estadoConexion).etiqueta} />,
      })}
      campos={[
        { key: 'nombre', label: 'Nombre', tipo: 'text', requerido: true },
        { key: 'tipoJuego', label: 'Tipo de juego', tipo: 'select', requerido: true, opciones: TIPO_JUEGO, ancho: 'half' },
        { key: 'estadoConexion', label: 'Conexión', tipo: 'select', requerido: true, opciones: CONEXION, ancho: 'half' },
      ]}
      crear={(v) => exergames.crearEstacion({ nombre: v.nombre, tipoJuego: v.tipoJuego as EstacionXrRequestDTO['tipoJuego'], estadoConexion: v.estadoConexion as EstacionXrRequestDTO['estadoConexion'] })}
    />
  )

  const desafiosTab = <DesafiosSeccion datos={desafios} puedeGestionar={esAdministrador} sesionId={sesionId} />

  const sesionesTab = <SesionesSeccion sesionId={sesionId} estaciones={estaciones.datos ?? []} puedeRegistrar={esAdministrador} />

  const protocolosTab = <ProtocolosSeccion sesionId={sesionId} />

  return (
    <>
      <PageHeader
        title="Exergames XR"
        lead="Estaciones, desafíos, sesiones, rankings y protocolos de seguridad, con datos reales del backend."
        breadcrumbs={[
          { label: 'SmartGym', to: '/panel' },
          { label: 'Experiencias' },
          { label: 'Exergames XR' },
        ]}
      />
      <Tabs
        tabs={[
          { id: 'estaciones', label: 'Estaciones', content: estacionesTab },
          { id: 'desafios', label: 'Desafíos y ranking', content: desafiosTab },
          { id: 'sesiones', label: 'Sesiones', content: sesionesTab },
          { id: 'protocolos', label: 'Protocolos de seguridad', content: protocolosTab },
        ]}
      />
    </>
  )
}

function DesafiosSeccion({ datos, puedeGestionar, sesionId }: { datos: ReturnType<typeof useApiData<DesafioResponseDTO[]>>; puedeGestionar: boolean; sesionId: string | null }) {
  const [desafioId, setDesafioId] = useState<string>('')
  const ranking = useApiData(() => (desafioId ? exergames.ranking(desafioId) : Promise.resolve<PuntajeRankingResponseDTO[]>([])), { requiereSesion: true })
  const registrar = useMutation((puntaje: number) => exergames.registrarPuntaje({ usuarioId: sesionId ?? '', desafioId, puntaje }))
  const [puntaje, setPuntaje] = useState('')

  return (
    <div className="d-grid gap-4">
      <CrudSection<DesafioResponseDTO>
        titulo="Desafíos"
        entidad="Desafío"
        datos={datos}
        puedeGestionar={puedeGestionar}
        illustration="plan"
        emptyTitle="Sin desafíos"
        emptyBody="Crea desafíos globales o mensuales con su vigencia."
        idDe={(d) => d.id}
        columnas={[
          { key: 'nombre', header: 'Desafío' },
          { key: 'tipo', header: 'Tipo' },
          { key: 'rango', header: 'Vigencia' },
          { key: 'acciones', header: '', align: 'end' },
        ]}
        fila={(d) => ({
          nombre: d.nombre,
          tipo: estadoVisual(d.tipo).etiqueta,
          rango: `${d.fechaInicio} → ${d.fechaFin}`,
          acciones: <AppButton variant="tertiary" size="sm" onClick={() => { setDesafioId(d.id); setTimeout(() => ranking.recargar(), 0) }}>Ver ranking</AppButton>,
        })}
        campos={[
          { key: 'nombre', label: 'Nombre', tipo: 'text', requerido: true },
          { key: 'tipo', label: 'Tipo', tipo: 'select', requerido: true, opciones: TIPO_DESAFIO, ancho: 'half' },
          { key: 'fechaInicio', label: 'Fecha inicio', tipo: 'date', requerido: true, ancho: 'half' },
          { key: 'fechaFin', label: 'Fecha fin', tipo: 'date', requerido: true, ancho: 'half' },
          { key: 'criterioPuntaje', label: 'Criterio de puntaje', tipo: 'text' },
        ]}
        crear={(v) => exergames.crearDesafio({ nombre: v.nombre, tipo: v.tipo as DesafioRequestDTO['tipo'], fechaInicio: v.fechaInicio, fechaFin: v.fechaFin, criterioPuntaje: v.criterioPuntaje || undefined })}
      />

      {desafioId ? (
        <section>
          <div className="d-flex flex-wrap gap-2 align-items-end justify-content-between mb-2">
            <h2 className="sg-section-title m-0">Ranking del desafío</h2>
            {sesionId ? (
              <div className="d-flex gap-2 align-items-end">
                <div>
                  <label className="sg-field-label d-block" htmlFor="puntaje">Registrar mi puntaje</label>
                  <input id="puntaje" className="form-control" type="number" value={puntaje} onChange={(e) => setPuntaje(e.target.value)} style={{ maxWidth: 140 }} />
                </div>
                <AppButton
                  size="sm"
                  onClick={async () => { if (!puntaje) return; try { await registrar.ejecutar(Number(puntaje)); setPuntaje(''); ranking.recargar() } catch { /* */ } }}
                  disabled={registrar.enviando || !puntaje}
                >
                  {registrar.enviando ? 'Enviando…' : 'Enviar puntaje'}
                </AppButton>
              </div>
            ) : null}
          </div>
          {registrar.error ? <p className="sg-form-note text-danger" role="alert">{registrar.error}</p> : null}
          <DataTable
            caption="Ranking del desafío seleccionado"
            pageSize={8}
            columns={[
              { key: 'posicion', header: '#' },
              { key: 'usuario', header: 'Usuario' },
              { key: 'puntaje', header: 'Puntaje', align: 'end' },
              { key: 'actualizado', header: 'Actualizado', align: 'end' },
            ]}
            rows={(ranking.datos ?? []).map((r, i) => ({
              posicion: r.posicion ?? i + 1,
              usuario: r.usuarioId,
              puntaje: r.puntaje,
              actualizado: fecha(r.actualizadoEn),
            }))}
            loading={ranking.estado === 'cargando' ? <p className="sg-note--muted p-3 m-0">Cargando ranking…</p> : undefined}
            emptyState={<p className="sg-note--muted p-3 m-0">Sin puntajes registrados para este desafío.</p>}
          />
        </section>
      ) : null}
    </div>
  )
}

function SesionesSeccion({ sesionId, estaciones, puedeRegistrar }: { sesionId: string | null; estaciones: EstacionXrResponseDTO[]; puedeRegistrar: boolean }) {
  const { showToast } = useToast()
  const [usuario, setUsuario] = useState(sesionId ?? '')
  const [consultado, setConsultado] = useState('')
  const [sesiones, setSesiones] = useState<SesionExergameResponseDTO[]>([])
  const [formAbierto, setFormAbierto] = useState(false)
  const consultar = useMutation((id: string) => exergames.sesionesPorUsuario(id))
  const registrar = useMutation((body: Parameters<typeof exergames.registrarSesion>[0]) => exergames.registrarSesion(body))

  const cargar = async (id: string) => {
    if (!id.trim()) return
    try {
      const data = await consultar.ejecutar(id.trim())
      setSesiones(data ?? [])
      setConsultado(id.trim())
    } catch { setSesiones([]) }
  }

  const registrarSesion = async (v: ValoresForm) => {
    try {
      await registrar.ejecutar({
        usuarioId: v.usuarioId,
        estacionId: v.estacionId,
        iniciadoEn: new Date(v.iniciadoEn).toISOString(),
        duracionSegundos: v.duracionSegundos ? Number(v.duracionSegundos) : undefined,
        origen: v.origen as Parameters<typeof exergames.registrarSesion>[0]['origen'],
      })
      showToast({ title: 'Sesión registrada', body: 'La sesión de exergame se guardó en el backend.' })
      setFormAbierto(false)
      if (consultado === v.usuarioId) cargar(v.usuarioId)
    } catch { /* error en registrar.error */ }
  }

  return (
    <div className="d-grid gap-3">
      <div className="d-flex flex-wrap gap-2 align-items-end justify-content-between">
        <div style={{ minWidth: 260 }}>
          <span className="sg-field-label d-block">Sesiones por usuario</span>
          <SearchField id="sesiones-usuario" label="UUID del usuario" placeholder="UUID del usuario" value={usuario} onChange={setUsuario} />
        </div>
        <div className="d-flex gap-2">
          <AppButton variant="secondary" onClick={() => cargar(usuario)} disabled={consultar.enviando || !usuario.trim()}>
            {consultar.enviando ? 'Consultando…' : 'Consultar sesiones'}
          </AppButton>
          {puedeRegistrar ? (
            <AppButton icon="mas" onClick={() => setFormAbierto(true)}>Registrar sesión</AppButton>
          ) : null}
        </div>
      </div>
      {consultar.error ? <p className="sg-form-note text-danger m-0" role="alert">{consultar.error}</p> : null}
      <DataTable
        caption="Sesiones de exergames del usuario consultado"
        pageSize={8}
        columns={[
          { key: 'estacion', header: 'Estación' },
          { key: 'inicio', header: 'Inicio' },
          { key: 'duracion', header: 'Duración', align: 'end' },
          { key: 'origen', header: 'Origen', align: 'end' },
        ]}
        rows={sesiones.map((s) => ({
          estacion: estaciones.find((e) => e.id === s.estacionId)?.nombre ?? s.estacionId,
          inicio: fecha(s.iniciadoEn),
          duracion: s.duracionSegundos ? `${s.duracionSegundos}s` : '—',
          origen: estadoVisual(s.origen).etiqueta,
        }))}
        emptyState={<NoContractState illustration="plan" title={consultado ? 'Sin sesiones' : 'Consulta un usuario'} body={consultado ? 'El usuario consultado no tiene sesiones registradas.' : 'Escribe un UUID y pulsa «Consultar sesiones».'} />}
      />

      <FormModal
        show={formAbierto}
        title="Registrar sesión de exergame"
        submitLabel="Registrar"
        enviando={registrar.enviando}
        error={registrar.error}
        onHide={() => setFormAbierto(false)}
        onSubmit={registrarSesion}
        campos={[
          { key: 'usuarioId', label: 'Usuario (UUID)', tipo: 'text', requerido: true },
          { key: 'estacionId', label: 'Estación', tipo: 'select', requerido: true, opciones: estaciones.map((e) => ({ value: e.id, label: e.nombre })) },
          { key: 'iniciadoEn', label: 'Inicio', tipo: 'datetime-local', requerido: true, ancho: 'half' },
          { key: 'duracionSegundos', label: 'Duración (s)', tipo: 'number', min: 0, ancho: 'half' },
          { key: 'origen', label: 'Origen', tipo: 'select', requerido: true, opciones: ORIGEN_SESION },
        ]}
      />
    </div>
  )
}

function ProtocolosSeccion({ sesionId }: { sesionId: string | null }) {
  const [usuario, setUsuario] = useState(sesionId ?? '')
  const [consultado, setConsultado] = useState('')
  const [protocolos, setProtocolos] = useState<ProtocoloSeguridadResponseDTO[]>([])
  const consultar = useMutation((id: string) => exergames.protocolosSeguridad(id))

  const cargar = async (id: string) => {
    if (!id.trim()) return
    try {
      const data = await consultar.ejecutar(id.trim())
      setProtocolos(data ?? [])
      setConsultado(id.trim())
    } catch { setProtocolos([]) }
  }

  return (
    <div className="d-grid gap-3">
      <div className="d-flex flex-wrap gap-2 align-items-end">
        <div style={{ minWidth: 260 }}>
          <span className="sg-field-label d-block">Protocolos por usuario</span>
          <SearchField id="protocolos-usuario" label="UUID del usuario" placeholder="UUID del usuario" value={usuario} onChange={setUsuario} />
        </div>
        <AppButton variant="secondary" onClick={() => cargar(usuario)} disabled={consultar.enviando || !usuario.trim()}>
          {consultar.enviando ? 'Consultando…' : 'Consultar protocolos'}
        </AppButton>
      </div>
      {consultar.error ? <p className="sg-form-note text-danger m-0" role="alert">{consultar.error}</p> : null}
      <ul className="sg-plain-list d-grid gap-2 m-0 p-0">
        {protocolos.length === 0 ? (
          <li className="sg-note--muted sg-surface--inset p-3">{consultado ? 'Sin protocolos de seguridad para este usuario.' : 'Escribe un UUID y consulta.'}</li>
        ) : (
          protocolos.map((p) => (
            <li key={p.id} className="sg-surface--inset p-3">
              <StatusBadge tone="info" label={estadoVisual(p.poblacionObjetivo).etiqueta} icon="privacidad" />
              <span className="ms-2">{p.restricciones}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
