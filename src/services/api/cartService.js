class CartService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'cart_item';
  }

  async getItems() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "productId" } },
          { field: { Name: "price" } },
          { field: { Name: "image" } },
          { field: { Name: "size" } },
          { field: { Name: "color" } },
          { field: { Name: "quantity" } }
        ],
        orderBy: [
          {
            fieldName: "CreatedOn",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching cart items:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching cart items:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async addItem(product, options = {}) {
    try {
      const cartItem = {
        Name: product.Name,
        productId: product.Id,
        price: product.price,
        image: Array.isArray(product.images) ? product.images[0] : product.images,
        size: options.size || (Array.isArray(product.sizes) ? product.sizes[0] : product.sizes),
        color: options.color || (Array.isArray(product.colors) ? product.colors[0] : product.colors),
        quantity: options.quantity || 1
      };

      // Check if item with same product, size, and color already exists
      const existingItems = await this.getItems();
      const existingItem = existingItems.find(item => 
        item.productId === cartItem.productId && 
        item.size === cartItem.size && 
        item.color === cartItem.color
      );

      if (existingItem) {
        // Update existing item quantity
        return await this.updateQuantity(existingItem.Id, existingItem.quantity + cartItem.quantity);
      } else {
        // Create new cart item
        const params = {
          records: [cartItem]
        };

        const response = await this.apperClient.createRecord(this.tableName, params);
        
        if (!response.success) {
          console.error(response.message);
          throw new Error(response.message);
        }

        if (response.results) {
          const failedRecords = response.results.filter(result => !result.success);
          
          if (failedRecords.length > 0) {
            console.error(`Failed to create cart item records:${JSON.stringify(failedRecords)}`);
            
            failedRecords.forEach(record => {
              record.errors?.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
              if (record.message) throw new Error(record.message);
            });
          }
          
          const successfulRecords = response.results.filter(result => result.success);
          return successfulRecords.length > 0 ? successfulRecords[0].data : cartItem;
        }

        return cartItem;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error adding item to cart:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error adding item to cart:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async updateQuantity(itemId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeItem(itemId);
      }

      const params = {
        records: [
          {
            Id: parseInt(itemId),
            quantity: quantity
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update cart item records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) throw new Error(record.message);
          });
        }
      }

      return await this.getItems();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating cart item quantity:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error updating cart item quantity:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async removeItem(itemId) {
    try {
      const params = {
        RecordIds: [parseInt(itemId)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete cart item records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }

      return await this.getItems();
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error removing cart item:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error removing cart item:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async clearCart() {
    try {
      const items = await this.getItems();
      if (items.length === 0) return [];

      const recordIds = items.map(item => item.Id);
      const params = {
        RecordIds: recordIds
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to clear cart records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }

      return [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error clearing cart:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error clearing cart:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getItemCount() {
    try {
      const items = await this.getItems();
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Error getting cart item count:", error.message);
      return 0;
    }
  }

  async getSubtotal() {
    try {
      const items = await this.getItems();
      return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    } catch (error) {
      console.error("Error calculating cart subtotal:", error.message);
      return 0;
    }
  }
}

export default new CartService();