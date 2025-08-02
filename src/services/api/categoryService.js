import categoriesData from "@/services/mockData/categories.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.data = [...categoriesData];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(150);
    const category = this.data.find(item => item.Id === parseInt(id));
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return { ...category };
  }

  async getBySlug(slug) {
    await delay(150);
    const category = this.data.find(item => item.slug === slug);
    if (!category) {
      throw new Error(`Category with slug ${slug} not found`);
    }
    return { ...category };
  }

  async getMainCategories() {
    await delay(150);
    return this.data.filter(item => ["men", "women", "accessories"].includes(item.slug));
  }
}

export default new CategoryService();