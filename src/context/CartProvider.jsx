import { useState, useEffect } from "react";
import apiService from "../services/apiService";
import {
  CART_STORAGE_KEY,
  ORDERS_STORAGE_KEY,
  CART_EXPIRATION,
} from "./cartUtils";
import { CartContext } from "./CartContext";

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  // Cargar carrito y pedidos del localStorage al iniciar
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
          const { items, timestamp } = JSON.parse(storedCart);
          const now = new Date().getTime();

          // Verificar si el carrito no ha expirado
          if (now - timestamp < CART_EXPIRATION && items) {
            setCartItems(items);
            const count = items.reduce(
              (total, item) => total + item.quantity,
              0
            );
            setCartCount(count);
          } else {
            // El carrito ha expirado, limpiarlo
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }

        // Cargar historial de pedidos
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
      }
    };

    loadCart();
  }, []);

  // Guardar carrito en localStorage cada vez que se actualiza
  useEffect(() => {
    if (cartItems.length > 0) {
      try {
        const cartData = {
          items: cartItems,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
    }
  }, [cartItems]);

  // Guardar pedidos en localStorage cada vez que se actualizan
  useEffect(() => {
    if (orders.length > 0) {
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error("Error saving orders to localStorage:", error);
      }
    }
  }, [orders]);

  const addToCart = async (
    productId,
    colorCode,
    storageCode,
    quantity = 1,
    productDetails = null
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Llamada a la API para añadir al carrito
      const response = await apiService.addToCart(
        productId,
        colorCode,
        storageCode
      );

      // Buscar si el producto ya está en el carrito
      const existingItemIndex = cartItems.findIndex(
        (item) =>
          item.id === productId &&
          item.colorCode === colorCode &&
          item.storageCode === storageCode
      );

      // Clonar el array de items actual
      const updatedItems = [...cartItems];

      if (existingItemIndex >= 0) {
        // Si el producto ya está en el carrito, aumentar la cantidad
        updatedItems[existingItemIndex].quantity += quantity;
      } else {
        // Si es un producto nuevo, añadirlo al carrito
        updatedItems.push({
          id: productId,
          colorCode,
          storageCode,
          quantity,
          details: productDetails,
        });
      }

      // Actualizar el estado
      setCartItems(updatedItems);
      const newCount = updatedItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(newCount);

      return response;
    } catch (err) {
      setError("Error al añadir al carrito");
      console.error("Error in addToCart:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (itemIndex, newQuantity) => {
    // Si la cantidad es menor que 1, eliminar el producto
    if (newQuantity < 1) {
      removeItem(itemIndex);
      return;
    }

    const updatedItems = [...cartItems];
    updatedItems[itemIndex].quantity = newQuantity;

    setCartItems(updatedItems);
    const newCount = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(newCount);
  };

  const removeItem = (itemIndex) => {
    const updatedItems = cartItems.filter((_, index) => index !== itemIndex);
    setCartItems(updatedItems);
    const newCount = updatedItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(newCount);

    if (updatedItems.length === 0) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Procesar la compra
  const checkout = async (customerInfo = {}) => {
    if (cartItems.length === 0) return null;

    try {
      setLoading(true);

      // Crear un objeto de pedido
      const order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        items: [...cartItems],
        customerInfo,
        total: cartItems.reduce((total, item) => {
          const price = item.details?.price
            ? parseFloat(item.details.price)
            : 0;
          return total + price * item.quantity;
        }, 0),
        date: new Date().toISOString(),
        status: "completed",
      };

      // Añadir el pedido al historial
      const updatedOrders = [order, ...orders];
      setOrders(updatedOrders);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

      // Limpiar el carrito
      clearCart();
      setIsCartOpen(false);

      return order;
    } catch (error) {
      console.error("Error during checkout:", error);
      setError("Error al procesar la compra");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    error,
    isCartOpen,
    orders,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    toggleCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;