import axios from 'axios';

// Tiempo de expiración para la caché (1 hora en milisegundos)
const CACHE_EXPIRATION = 60 * 60 * 1000;

// API Base URL
const API_BASE_URL = 'https://itx-frontend-test.onrender.com';

// Clave para la caché en localStorage
const CACHE_STORAGE_KEY = 'mobile_shop_api_cache';

/**
 * Sistema de cacheo para las peticiones API con persistencia en localStorage
 */
class ApiCache {
  constructor() {
    this.loadCacheFromStorage();
  }

  /**
   * Carga la caché desde localStorage
   */
  loadCacheFromStorage() {
    try {
      const storedCache = localStorage.getItem(CACHE_STORAGE_KEY);
      this.cache = storedCache ? JSON.parse(storedCache) : {};
      // Limpiar elementos expirados al cargar
      this.cleanExpiredItems();
    } catch (error) {
      console.error('Error loading cache from localStorage:', error);
      this.cache = {};
    }
  }

  /**
   * Guarda la caché en localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Error saving cache to localStorage:', error);
    }
  }

  /**
   * Limpia elementos expirados de la caché
   */
  cleanExpiredItems() {
    const now = new Date().getTime();
    let changed = false;
    
    Object.keys(this.cache).forEach(key => {
      if ((now - this.cache[key].timestamp) >= CACHE_EXPIRATION) {
        delete this.cache[key];
        changed = true;
      }
    });
    
    if (changed) {
      this.saveToStorage();
    }
  }

  /**
   * Verifica si la cache es válida para una clave determinada
   */
  isValid(key) {
    const cacheItem = this.cache[key];
    if (!cacheItem) return false;
    
    const now = new Date().getTime();
    return (now - cacheItem.timestamp) < CACHE_EXPIRATION;
  }

  /**
   * Guarda los datos en cache con timestamp
   */
  set(key, data) {
    this.cache[key] = {
      data,
      timestamp: new Date().getTime()
    };
    this.saveToStorage();
  }

  /**
   * Obtiene los datos de la cache si son válidos
   */
  get(key) {
    this.cleanExpiredItems();
    return this.isValid(key) ? this.cache[key].data : null;
  }

  /**
   * Limpia toda la cache
   */
  clear() {
    this.cache = {};
    localStorage.removeItem(CACHE_STORAGE_KEY);
  }
}

// Instancia del sistema de caché
const apiCache = new ApiCache();

/**
 * Clase para los servicios de API con sistema de cacheo
 */
class ApiService {
  constructor() {
    // Crear instancia de axios
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * Obtiene la lista de productos
   */
  async getProducts() {
    const cacheKey = 'products-list';
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
      console.log('Using cached products list');
      return cachedData;
    }
    
    try {
      console.log('Fetching products from API');
      const response = await this.api.get('/api/product');
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Obtiene el detalle de un producto por ID
   */
  async getProductById(productId) {
    const cacheKey = `product-${productId}`;
    const cachedData = apiCache.get(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached product ${productId}`);
      return cachedData;
    }
    
    try {
      console.log(`Fetching product ${productId} from API`);
      const response = await this.api.get(`/api/product/${productId}`);
      apiCache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Añade un producto al carrito
   */
  async addToCart(productId, colorCode, storageCode) {
    // No se cachea esta operación ya que es un POST
    try {
      const response = await this.api.post('/api/cart', {
        id: productId,
        colorCode,
        storageCode
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }
}

// Exportamos una instancia única del servicio
export default new ApiService();
