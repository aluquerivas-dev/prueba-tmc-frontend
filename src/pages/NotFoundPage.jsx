import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-8">Página no encontrada</h2>
      <p className="text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
