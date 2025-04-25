import { useContext } from 'react';
import { CartContext } from './CartContext'; // Importando desde el nuevo archivo

export function useCart() {
  return useContext(CartContext);
}
