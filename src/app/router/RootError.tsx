import { ErrorState } from '../../components/feedback/ErrorState'

export function RootError() {
  return (
    <main className="d-grid align-content-center min-vh-100">
      <ErrorState detail="Se produjo un error inesperado al renderizar esta vista. El detalle quedó registrado en la consola de desarrollo." />
    </main>
  )
}
