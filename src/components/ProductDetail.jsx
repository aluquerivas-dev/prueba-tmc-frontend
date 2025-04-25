import { useState } from 'react'

function ProductDetail({ product, onAddToCart, isLoading }) {
  const [selectedColor, setSelectedColor] = useState(product.options?.colors?.[0]?.code || 0)
  const [selectedStorage, setSelectedStorage] = useState(product.options?.storages?.[0]?.code || 0)
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddToCart(selectedColor, selectedStorage, quantity)
  }

  // Función para renderizar arrays como strings
  const renderArray = (arr) => {
    if (!arr) return 'No disponible';
    return Array.isArray(arr) ? arr.join(', ') : arr;
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  return (
    <div className="card">
      <div className="md:flex items-start">
        <div className="md:w-1/4 p-6 flex justify-center">
          <img 
            src={product.imgUrl || 'https://via.placeholder.com/300'} 
            alt={product.model}
            className="w-auto max-h-64 object-contain"
          />
        </div>
        <div className="p-6 md:w-3/4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {product.brand} {product.model}
          </h1>
          <p className="text-xl text-primary font-bold mb-4">
            {product.price ? `${product.price}€` : 'Precio no disponible'}
          </p>
          
          <div className="mb-4">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
              {product.status || 'En stock'}
            </span>
          </div>
          
          <div className="prose max-w-none mb-6">
            <p className="text-gray-600">{product.description || 'Sin descripción disponible'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {product.options?.colors && product.options.colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-gray-700">Color:</label>
                <div className="flex flex-wrap gap-2">
                  {product.options.colors.map((color) => (
                    <button
                      key={color.code}
                      type="button"
                      onClick={() => setSelectedColor(color.code)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedColor === color.code
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.options?.storages && product.options.storages.length > 0 && (
              <div className="space-y-2">
                <label className="block text-gray-700">Capacidad:</label>
                <div className="flex flex-wrap gap-2">
                  {product.options.storages.map((storage) => (
                    <button
                      key={storage.code}
                      type="button"
                      onClick={() => setSelectedStorage(storage.code)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedStorage === storage.code
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300"
                      }`}
                    >
                      {storage.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de cantidad */}
            <div className="space-y-2">
              <label className="block text-gray-700">Cantidad:</label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="bg-gray-200 rounded-l-md px-4 py-2 border border-gray-300"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border-t border-b border-gray-300 px-4 py-2 w-16 text-center"
                />
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="bg-gray-200 rounded-r-md px-4 py-2 border border-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Añadiendo...' : 'Añadir al carrito'}
            </button>
          </form>
          
          {/* Información detallada del producto */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Especificaciones técnicas
            </h2>

            {/* Red y conectividad */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">
                Red y Conectividad
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Tecnología:</span>
                  <span>{product.networkTechnology || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Velocidad:</span>
                  <span>{product.networkSpeed || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">GPRS:</span>
                  <span>{product.gprs || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">EDGE:</span>
                  <span>{product.edge || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Wi-Fi:</span>
                  <span>{product.wlan || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Bluetooth:</span>
                  <span>{product.bluetooth || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">GPS:</span>
                  <span>{product.gps || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">NFC:</span>
                  <span>{product.nfc || "No"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Radio:</span>
                  <span>{product.radio || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">USB:</span>
                  <span>{product.usb || "No disponible"}</span>
                </div>
              </div>
            </div>

            {/* Diseño y pantalla */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">
                Diseño y Pantalla
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Dimensiones:</span>
                  <span>{product.dimentions || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Peso:</span>
                  <span>{product.weight || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">SIM:</span>
                  <span>{renderArray(product.sim)}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Pantalla:</span>
                  <span>{product.displayType || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Tamaño:</span>
                  <span>{product.displaySize || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Resolución:</span>
                  <span>{product.displayResolution || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Colores:</span>
                  <span>{renderArray(product.colors)}</span>
                </div>
              </div>
            </div>

            {/* Rendimiento */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Rendimiento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Sistema:</span>
                  <span>{product.os || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Chipset:</span>
                  <span>{product.chipset || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">CPU:</span>
                  <span>{product.cpu || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">GPU:</span>
                  <span>{product.gpu || "No disponible"}</span>
                </div>
              </div>
            </div>

            {/* Memoria */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Memoria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex">
                  <span className="font-medium w-32">RAM:</span>
                  <span>{product.ram || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Interna:</span>
                  <span>{renderArray(product.internalMemory)}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Externa:</span>
                  <span>{product.externalMemory || "No disponible"}</span>
                </div>
              </div>
            </div>

            {/* Cámaras */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">Cámaras</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Principal:</span>
                  <span>{renderArray(product.primaryCamera)}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Secundaria:</span>
                  <span>{product.secondaryCmera || "No disponible"}</span>
                </div>
              </div>
            </div>

            {/* Características adicionales */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2">
                Características adicionales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex">
                  <span className="font-medium w-32">Altavoz:</span>
                  <span>{product.speaker || "No"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Jack 3.5mm:</span>
                  <span>{product.audioJack || "No"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Sensores:</span>
                  <span>{renderArray(product.sensors)}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Batería:</span>
                  <span>{product.battery || "No disponible"}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32">Anunciado:</span>
                  <span>{product.announced || "No disponible"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
