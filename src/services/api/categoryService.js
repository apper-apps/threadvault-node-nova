import mockCategories from '../mockData/categories.json';

class CategoryService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
  }
async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "image" } },
          { field: { Name: "productCount" } },
          { field: { Name: "description" } },
          { field: { Name: "subcategories" } },
          { field: { Name: "Tags" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        console.log("Database query failed or returned no results, falling back to mock data");
        return mockCategories.map(cat => ({
          Id: cat.Id,
          Name: cat.name,
          slug: cat.slug,
          image: cat.image,
          productCount: cat.productCount,
          description: cat.description,
          subcategories: JSON.stringify(cat.subcategories)
        }));
      }

      return response.data;
    } catch (error) {
      console.log("Database error occurred, falling back to mock data:", error.message);
      return mockCategories.map(cat => ({
        Id: cat.Id,
        Name: cat.name,
        slug: cat.slug,
        image: cat.image,
        productCount: cat.productCount,
        description: cat.description,
        subcategories: JSON.stringify(cat.subcategories)
      }));
    }
  }

async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "image" } },
          { field: { Name: "productCount" } },
          { field: { Name: "description" } },
          { field: { Name: "subcategories" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success || !response.data) {
        console.log(`Database query failed for ID ${id}, searching in mock data`);
        const mockCategory = mockCategories.find(cat => cat.Id === parseInt(id));
        if (mockCategory) {
          return {
            Id: mockCategory.Id,
            Name: mockCategory.name,
            slug: mockCategory.slug,
            image: mockCategory.image,
            productCount: mockCategory.productCount,
            description: mockCategory.description,
            subcategories: JSON.stringify(mockCategory.subcategories)
          };
        }
        throw new Error(`Category with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.log(`Database error for ID ${id}, searching in mock data:`, error.message);
      const mockCategory = mockCategories.find(cat => cat.Id === parseInt(id));
      if (mockCategory) {
        return {
          Id: mockCategory.Id,
          Name: mockCategory.name,
          slug: mockCategory.slug,
          image: mockCategory.image,
          productCount: mockCategory.productCount,
          description: mockCategory.description,
          subcategories: JSON.stringify(mockCategory.subcategories)
        };
      }
      throw new Error(`Category with id ${id} not found`);
    }
  }

async getBySlug(slug) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "image" } },
          { field: { Name: "productCount" } },
          { field: { Name: "description" } },
          { field: { Name: "subcategories" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "slug",
            Operator: "EqualTo",
            Values: [slug]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        console.log(`Database query failed for slug ${slug}, searching in mock data`);
        const mockCategory = mockCategories.find(cat => cat.slug === slug);
        if (mockCategory) {
          return {
            Id: mockCategory.Id,
            Name: mockCategory.name,
            slug: mockCategory.slug,
            image: mockCategory.image,
            productCount: mockCategory.productCount,
            description: mockCategory.description,
            subcategories: JSON.stringify(mockCategory.subcategories)
          };
        }
        throw new Error(`Category with slug ${slug} not found`);
      }

      return response.data[0];
    } catch (error) {
      console.log(`Database error for slug ${slug}, searching in mock data:`, error.message);
      const mockCategory = mockCategories.find(cat => cat.slug === slug);
      if (mockCategory) {
        return {
          Id: mockCategory.Id,
          Name: mockCategory.name,
          slug: mockCategory.slug,
          image: mockCategory.image,
          productCount: mockCategory.productCount,
          description: mockCategory.description,
          subcategories: JSON.stringify(mockCategory.subcategories)
        };
      }
      throw new Error(`Category with slug ${slug} not found`);
    }
  }

async getMainCategories() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "slug" } },
          { field: { Name: "image" } },
          { field: { Name: "productCount" } },
          { field: { Name: "description" } },
          { field: { Name: "subcategories" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "slug",
            Operator: "ExactMatch",
            Values: ["men", "women", "accessories"]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        console.log("Database query failed for main categories, filtering mock data");
        const mainCategorySlugs = ["men", "women", "accessories"];
        return mockCategories
          .filter(cat => mainCategorySlugs.includes(cat.slug))
          .map(cat => ({
            Id: cat.Id,
            Name: cat.name,
            slug: cat.slug,
            image: cat.image,
            productCount: cat.productCount,
            description: cat.description,
            subcategories: JSON.stringify(cat.subcategories)
          }));
      }

      return response.data;
    } catch (error) {
      console.log("Database error for main categories, filtering mock data:", error.message);
      const mainCategorySlugs = ["men", "women", "accessories"];
      return mockCategories
        .filter(cat => mainCategorySlugs.includes(cat.slug))
        .map(cat => ({
          Id: cat.Id,
          Name: cat.name,
          slug: cat.slug,
          image: cat.image,
          productCount: cat.productCount,
          description: cat.description,
          subcategories: JSON.stringify(cat.subcategories)
        }));
    }
  }
}

export default new CategoryService();