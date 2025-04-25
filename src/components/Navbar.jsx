import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

function Navbar() {
  const { cartCount, toggleCart } = useCart()

  return (
    <header className="bg-gradient-to-r from-primary to-secondary shadow fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Mobile Shop
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-white/80 font-medium">
              Inicio
            </Link>
            <Link to="/orders" className="text-white hover:text-white/80 font-medium">
              Mis Pedidos
            </Link>
            <div className="relative">
              <button 
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                onClick={toggleCart}
                aria-label="Ver carrito de compras"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
