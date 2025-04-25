function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Mobile Shop. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm">Creado con React + Vite y Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
