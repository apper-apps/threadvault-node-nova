const CART_STORAGE_KEY = "threadvault_cart";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CartService {
  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      this.items = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }

  async getItems() {
    await delay(100);
    return [...this.items];
  }

  async addItem(product, options = {}) {
    await delay(150);
    
    const cartItem = {
      Id: Date.now(), // Unique cart item ID
      productId: product.Id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: options.size || product.sizes[0],
      color: options.color || product.colors[0],
      quantity: options.quantity || 1
    };

    // Check if item with same product, size, and color already exists
    const existingItemIndex = this.items.findIndex(item => 
      item.productId === cartItem.productId && 
      item.size === cartItem.size && 
      item.color === cartItem.color
    );

    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += cartItem.quantity;
    } else {
      this.items.push(cartItem);
    }

    this.saveToStorage();
    return { ...cartItem };
  }

  async updateQuantity(itemId, quantity) {
    await delay(100);
    
    const itemIndex = this.items.findIndex(item => item.Id === parseInt(itemId));
    if (itemIndex === -1) {
      throw new Error(`Cart item with id ${itemId} not found`);
    }

    if (quantity <= 0) {
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }

    this.saveToStorage();
    return [...this.items];
  }

  async removeItem(itemId) {
    await delay(100);
    
    const itemIndex = this.items.findIndex(item => item.Id === parseInt(itemId));
    if (itemIndex === -1) {
      throw new Error(`Cart item with id ${itemId} not found`);
    }

    this.items.splice(itemIndex, 1);
    this.saveToStorage();
    return [...this.items];
  }

  async clearCart() {
    await delay(100);
    this.items = [];
    this.saveToStorage();
    return [];
  }

  async getItemCount() {
    await delay(50);
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  async getSubtotal() {
    await delay(50);
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export default new CartService();