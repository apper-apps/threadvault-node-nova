import productsData from "@/services/mockData/products.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProductService {
  constructor() {
    this.data = [...productsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const product = this.data.find(item => item.Id === parseInt(id));
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return { ...product };
  }

  async getByCategory(category, filters = {}) {
    await delay(400);
    let filteredData = [...this.data];

    // Filter by category
    if (category && category !== "all") {
      if (category === "new-arrivals") {
        filteredData = filteredData.filter(item => item.newArrival);
      } else if (category === "sale") {
        filteredData = filteredData.filter(item => item.discount > 0);
      } else if (category === "men") {
        filteredData = filteredData.filter(item => item.gender === "men" || item.gender === "unisex");
      } else if (category === "women") {
        filteredData = filteredData.filter(item => item.gender === "women" || item.gender === "unisex");
      } else {
        filteredData = filteredData.filter(item => item.category === category);
      }
    }

    // Apply additional filters
    if (filters.subcategory) {
      filteredData = filteredData.filter(item => item.subcategory === filters.subcategory);
    }

    if (filters.gender && filters.gender !== "all") {
      filteredData = filteredData.filter(item => item.gender === filters.gender || item.gender === "unisex");
    }

    if (filters.minPrice !== undefined) {
      filteredData = filteredData.filter(item => item.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filteredData = filteredData.filter(item => item.price <= filters.maxPrice);
    }

    if (filters.colors && filters.colors.length > 0) {
      filteredData = filteredData.filter(item => 
        item.colors.some(color => filters.colors.includes(color))
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filteredData = filteredData.filter(item => 
        item.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-low":
          filteredData.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredData.sort((a, b) => b.price - a.price);
          break;
        case "name":
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "newest":
          filteredData.sort((a, b) => b.Id - a.Id);
          break;
        default:
          break;
      }
    }

    return filteredData;
  }

  async getFeatured() {
    await delay(250);
    return this.data.filter(item => item.featured);
  }

  async getNewArrivals() {
    await delay(250);
    return this.data.filter(item => item.newArrival);
  }

  async getSaleItems() {
    await delay(250);
    return this.data.filter(item => item.discount > 0);
  }

  async search(query) {
    await delay(300);
    const searchTerm = query.toLowerCase();
    return this.data.filter(item => 
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getRelatedProducts(productId, limit = 4) {
    await delay(200);
    const product = this.data.find(item => item.Id === parseInt(productId));
    if (!product) return [];

    return this.data
      .filter(item => 
        item.Id !== product.Id && 
        (item.category === product.category || item.gender === product.gender)
      )
      .slice(0, limit);
  }
}

export default new ProductService();