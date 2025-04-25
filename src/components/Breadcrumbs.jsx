import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/apiService";

function Breadcrumbs() {
  const location = useLocation();
  const { productId } = useParams();
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchProductName = async () => {
      if (productId) {
        try {
          const product = await apiService.getProductById(productId);
          setProductName(`${product.brand} ${product.model}`);
        } catch (error) {
          console.error("Error fetching product name:", error);
        }
      }
    };

    fetchProductName();
  }, [productId]);

  // Obtener las partes de la ruta actual
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  // Mapear rutas a nombres legibles
  const getPathName = (path) => {
    const pathMap = {
      "": "Inicio",
      product: "Producto",
      orders: "Mis Pedidos",
    };

    return pathMap[path] || path;
  };

  return (
    <nav className="bg-gray-100 py-2 px-4 shadow-sm mb-6">
      <div className="container mx-auto">
        <ol className="flex flex-wrap items-center text-sm">
          <li className="flex items-center">
            <Link to="/" className="text-primary hover:text-primary/80">
              Inicio
            </Link>
          </li>

          {pathSegments.map((segment, index) => {
            // Construir la ruta hasta este segmento
            const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            const isProductId = segment === productId;
            const isProductSegment = segment === "product";

            return (
              <li key={segment} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="font-medium text-gray-800">
                    {isProductId ? productName : getPathName(segment)}
                  </span>
                ) : // Si es el segmento 'product' y hay un productId, no lo hacemos clicable
                isProductSegment && productId ? (
                  <span className="text-gray-600">{getPathName(segment)}</span>
                ) : (
                  <Link to={url} className="text-primary hover:text-primary/80">
                    {getPathName(segment)}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumbs;
