import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

function OrdersPage() {
  const { orders } = useCart()
  const [expandedOrderId, setExpandedOrderId] = useState(null)

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null)
    } else {
      setExpandedOrderId(orderId)
    }
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Historial de Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl font-medium text-gray-500 mb-4">No tienes pedidos</p>
          <p className="text-gray-500 mb-6">Todavía no has realizado ningún pedido.</p>
          <Link to="/" className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div>
                  <span className="block text-sm text-gray-500 mb-1">Pedido #{order.id.substring(6, 14)}</span>
                  <span className="font-medium">{formatDate(order.date)}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-primary">{order.total.toFixed(2)}€</span>
                  <span 
                    className={`transform transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              
              {expandedOrderId === order.id && (
                <div className="border-t p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Detalles del pedido</h3>
                  
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => {
                      const details = item.details;
                      if (!details) return null;
                      
                      const selectedColor = details.options?.colors?.find(c => c.code === item.colorCode)?.name || '';
                      const selectedStorage = details.options?.storages?.find(s => s.code === item.storageCode)?.name || '';
                      const price = details.price ? parseFloat(details.price) : 0;
                      
                      return (
                        <div key={idx} className="flex p-2 hover:bg-gray-100 rounded-lg">
                          <div className="w-16 h-16 mr-3">
                            <img 
                              src={details.imgUrl || 'https://via.placeholder.com/64'} 
                              alt={`${details.brand} ${details.model}`}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-medium">{details.brand} {details.model}</span>
                              <span>{(price * item.quantity).toFixed(2)}€</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {selectedColor && <span>Color: {selectedColor}{" "}</span>}
                              {selectedStorage && <span>Capacidad: {selectedStorage}</span>}
                            </div>
                            <div className="text-sm">
                              <span>Cantidad: {item.quantity}</span>
                              <span className="mx-2">·</span>
                              <span>Precio unitario: {price.toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {order.customerInfo && (
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Información de envío</h4>
                      <p className="text-sm">{order.customerInfo.name}</p>
                      <p className="text-sm">{order.customerInfo.email}</p>
                      <p className="text-sm whitespace-pre-line">{order.customerInfo.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
