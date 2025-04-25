import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import apiService from '../services/apiService'
import { useCart } from '../context/useCart'
import ProductDetail from '../components/ProductDetail'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartSuccess, setCartSuccess] = useState(false)
  
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true)
      setError(null)

      try {
        const productData = await apiService.getProductById(productId)
        setProduct(productData)
      } catch (err) {
        console.error("Error fetching product data:", err)
        setError(
          "Ha ocurrido un error al cargar los datos del producto. Por favor, inténtalo de nuevo."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productId])

  const handleAddToCart = async (colorCode, storageCode, quantity) => {
    try {
      setAddingToCart(true)
      console.log('Adding to cart:', productId, colorCode, storageCode, quantity)
      await addToCart(productId, colorCode, storageCode, quantity, product)
      setCartSuccess(true)
      setTimeout(() => setCartSuccess(false), 3000)
    } catch (err) {
      setError('Error al añadir el producto al carrito')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {product && (
        <>
          <ProductDetail 
            product={product} 
            onAddToCart={handleAddToCart} 
            isLoading={addingToCart}
          />
          
          {cartSuccess && (
            <div className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-lg shadow-lg">
              Producto añadido al carrito correctamente
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 text-center">
        <Link to="/" className="text-primary hover:underline inline-block">
          &larr; Volver al catálogo
        </Link>
      </div>
    </div>
  )
}

export default ProductDetailPage
