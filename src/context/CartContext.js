import { createContext } from "react";
import CartProvider from "./CartProvider"; // Importamos el proveedor

// Creando el contexto);
export const CartContext = createContext();

// Reexportamos el proveedor como exportación por defecto
export default CartProvider;
