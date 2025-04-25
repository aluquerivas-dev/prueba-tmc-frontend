import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Breadcrumbs from './Breadcrumbs'

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-16"> {/* Espacio para que el contenido no quede detrás del navbar fijo */}
        <Breadcrumbs />
        <main className="flex-grow px-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
