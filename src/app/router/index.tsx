import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Root } from './Root'
import { RootError } from './RootError'
import InicioPage from '../../features/inicio/InicioPage'
import IngresarPage from '../../features/auth/IngresarPage'
import PanelPage from '../../features/panel/PanelPage'
import AccesosPage from '../../features/access-nfc/AccesosPage'
import MaquinasPage from '../../features/iot-machines/MaquinasPage'
import AgendaPage from '../../features/scheduling/AgendaPage'
import DeportistasPage from '../../features/clinical-record/DeportistasPage'
import AlertasPage from '../../features/medical-risk/AlertasPage'
import PlanesPage from '../../features/plans/PlanesPage'
import XrPage from '../../features/exergames/XrPage'
import ReportesPage from '../../features/reports/ReportesPage'
import AuditoriaPage from '../../features/governance/AuditoriaPage'
import PrivacidadPage from '../../features/governance/PrivacidadPage'
import NotFoundPage from '../../features/not-found/NotFoundPage'
import { RequireSession } from './RequireSession'

const routerFuture = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true,
}

export const router = createBrowserRouter(
  [
  {
    path: '/',
    element: <Root />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <Navigate to="/inicio" replace /> },
      { path: 'inicio', element: <InicioPage /> },
      { path: 'ingresar', element: <IngresarPage /> },
      {
        element: <RequireSession />,
        children: [
          { path: 'panel', element: <PanelPage /> },
          { path: 'operacion/accesos', element: <AccesosPage /> },
          { path: 'operacion/maquinas', element: <MaquinasPage /> },
          { path: 'operacion/agenda', element: <AgendaPage /> },
          { path: 'atencion/deportistas', element: <DeportistasPage /> },
          { path: 'atencion/alertas', element: <AlertasPage /> },
          { path: 'atencion/planes', element: <PlanesPage /> },
          { path: 'experiencias/xr', element: <XrPage /> },
          { path: 'analisis/reportes', element: <ReportesPage /> },
          { path: 'administracion/auditoria', element: <AuditoriaPage /> },
          { path: 'administracion/privacidad', element: <PrivacidadPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    },
  ],
  { future: routerFuture },
)
