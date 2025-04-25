import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import apiService from '../services/apiService'

function CartSummary() {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    clearCart,
    checkout
  } = useCart()
  
  const [productDetails, setProductDetails] = useState({})
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart', 'checkout', 'success'
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  })
  const [orderCompleted, setOrderCompleted] = useState(null)
  
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar detalles de productos para los que no tenemos información
    const fetchMissingDetails = async () => {
      const missingDetails = cartItems.filter(item => !item.details);
      
      for (const item of missingDetails) {
        try {
          if (!productDetails[item.id]) {
            const details = await apiService.getProductById(item.id);
            setProductDetails(prev => ({
              ...prev,
              [item.id]: details
            }));
          }
        } catch (error) {
          console.error(`Error fetching details for product ${item.id}:`, error);
        }
      }
    };
    
    if (isCartOpen && cartItems.some(item => !item.details)) {
      fetchMissingDetails();
    }
  }, [cartItems, isCartOpen, productDetails]);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckout = async () => {
    if (checkoutStep === 'cart') {
      setCheckoutStep('checkout');
      return;
    }
    
    try {
      const order = await checkout(customerInfo);
      setOrderCompleted(order);
      setCheckoutStep('success');
    } catch (error) {
      console.error('Error completing checkout:', error);
    }
  }

  const handleViewOrders = () => {
    toggleCart();
    navigate('/orders');
  }

  const handleContinueShopping = () => {
    toggleCart();
    setCheckoutStep('cart');
    setOrderCompleted(null);
  }

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const details = item.details || productDetails[item.id];
      const price = details?.price ? parseFloat(details.price) : 0;
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  // Obtener detalles del producto (color y almacenamiento seleccionados)
  const getItemDetails = (item) => {
    const details = item.details || productDetails[item.id];
    
    if (!details) return { name: 'Cargando...', color: '', storage: '', price: 0, imgUrl: '' };
    
    const selectedColor = details.options?.colors?.find(c => c.code === item.colorCode)?.name || '';
    const selectedStorage = details.options?.storages?.find(s => s.code === item.storageCode)?.name || '';
    
    return {
      name: `${details.brand} ${details.model}`,
      color: selectedColor,
      storage: selectedStorage,
      price: details.price ? parseFloat(details.price) : 0,
      imgUrl: details.imgUrl || ''
    };
  };

  if (!isCartOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto flex flex-col">
        <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-primary to-secondary text-white">
          <h2 className="text-xl font-bold">
            {checkoutStep === 'cart' && 'Tu carrito de compras'}
            {checkoutStep === 'checkout' && 'Finalizar compra'}
            {checkoutStep === 'success' && 'Pedido completado'}
          </h2>
          <button 
            onClick={toggleCart}
            className="text-white hover:bg-white/10 p-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {checkoutStep === 'cart' && (
          <>
            <div className="flex-grow p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <button 
                    onClick={toggleCart}
                    className="mt-4 text-primary hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const itemDetails = getItemDetails(item);
                    const itemTotal = (itemDetails.price * item.quantity).toFixed(2);
                    
                    return (
                      <div key={index} className="border rounded-lg p-4 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex">
                          {/* Imagen del producto */}
                          <div className="w-20 h-20 mr-4 flex-shrink-0">
                            <img 
                              src={itemDetails.imgUrl || 'https://via.placeholder.com/80'} 
                              alt={itemDetails.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium">{itemDetails.name}</h3>
                              <button 
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            {itemDetails.color && (
                              <div className="text-sm text-gray-600">Color: {itemDetails.color}</div>
                            )}
                            
                            {itemDetails.storage && (
                              <div className="text-sm text-gray-600">Capacidad: {itemDetails.storage}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="bg-gray-200 rounded-l-md px-3 py-1 text-sm"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-t border-b">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="bg-gray-200 rounded-r-md px-3 py-1 text-sm"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="font-semibold">
                            {itemTotal}€
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-gray-50">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{calculateTotal()}€</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Vaciar carrito
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Finalizar compra
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {checkoutStep === 'checkout' && (
          <div className="flex-grow p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Datos de contacto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de envío</label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleCustomerInfoChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Resumen del pedido</h4>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Productos ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span>{calculateTotal()}€</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>{calculateTotal()}€</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setCheckoutStep('cart')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Confirmar pedido
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'success' && orderCompleted && (
          <div className="flex-grow p-4">
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">¡Gracias por tu compra!</h3>
              <p className="text-gray-600 mb-4">Tu pedido ha sido procesado correctamente.</p>
              <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                <p className="font-medium">Número de pedido: {orderCompleted.id}</p>
                <p className="text-sm text-gray-600 mt-1">Fecha: {new Date(orderCompleted.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Total: {orderCompleted.total.toFixed(2)}€</p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleViewOrders}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Ver mis pedidos
              </button>
              <button
                onClick={handleContinueShopping}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartSummary
