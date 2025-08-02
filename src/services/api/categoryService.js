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
        console.error("Error fetching categories:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching categories:", error.message);
        throw new Error(error.message);
      }
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
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(`Category with id ${id} not found`);
      }

      if (!response.data) {
        throw new Error(`Category with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
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
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(`Category with slug ${slug} not found`);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error(`Category with slug ${slug} not found`);
      }

      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with slug ${slug}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching category with slug ${slug}:`, error.message);
        throw new Error(error.message);
      }
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
        console.error("Error fetching main categories:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching main categories:", error.message);
        throw new Error(error.message);
      }
    }
  }
}

export default new CategoryService();