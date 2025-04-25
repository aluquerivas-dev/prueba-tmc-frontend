function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col transform transition-all duration-300 hover:shadow-md">
      <div className="relative pb-[75%] overflow-hidden rounded-t-lg">
        <img 
          src={product.imgUrl || 'https://via.placeholder.com/300'} 
          alt={product.model}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {product.brand}
          </span>
        </div>
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">{product.model}</h3>
        <p className="text-primary font-bold mt-auto">
          {product.price ? `${product.price}€` : 'Precio no disponible'}
        </p>
      </div>
    </div>
  )
}

export default ProductCard
