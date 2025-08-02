class ProductService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'product';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
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
        console.error("Error fetching products:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching products:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(`Product with id ${id} not found`);
      }

      if (!response.data) {
        throw new Error(`Product with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching product with ID ${id}:`, error.message);
        throw new Error(error.message);
      }
    }
  }

  async getByCategory(category, filters = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ],
        where: [],
        orderBy: []
      };

      // Apply category filter
      if (category && category !== "all") {
        if (category === "new-arrivals") {
          params.where.push({
            FieldName: "newArrival",
            Operator: "EqualTo",
            Values: [true]
          });
        } else if (category === "sale") {
          params.where.push({
            FieldName: "discount",
            Operator: "GreaterThan",
            Values: [0]
          });
        } else if (category === "men") {
          params.where.push({
            FieldName: "gender",
            Operator: "ExactMatch",
            Values: ["men", "unisex"]
          });
        } else if (category === "women") {
          params.where.push({
            FieldName: "gender",
            Operator: "ExactMatch",
            Values: ["women", "unisex"]
          });
        } else {
          params.where.push({
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          });
        }
      }

      // Apply additional filters
      if (filters.subcategory) {
        params.where.push({
          FieldName: "subcategory",
          Operator: "EqualTo",
          Values: [filters.subcategory]
        });
      }

      if (filters.gender && filters.gender !== "all") {
        params.where.push({
          FieldName: "gender",
          Operator: "ExactMatch",
          Values: [filters.gender, "unisex"]
        });
      }

      if (filters.minPrice !== undefined) {
        params.where.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.minPrice]
        });
      }

      if (filters.maxPrice !== undefined) {
        params.where.push({
          FieldName: "price",
          Operator: "LessThanOrEqualTo",
          Values: [filters.maxPrice]
        });
      }

      if (filters.colors && filters.colors.length > 0) {
        params.where.push({
          FieldName: "colors",
          Operator: "Contains",
          Values: filters.colors
        });
      }

      if (filters.sizes && filters.sizes.length > 0) {
        params.where.push({
          FieldName: "sizes",
          Operator: "Contains",
          Values: filters.sizes
        });
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            params.orderBy.push({
              fieldName: "price",
              sorttype: "ASC"
            });
            break;
          case "price-high":
            params.orderBy.push({
              fieldName: "price",
              sorttype: "DESC"
            });
            break;
          case "name":
            params.orderBy.push({
              fieldName: "Name",
              sorttype: "ASC"
            });
            break;
          case "newest":
            params.orderBy.push({
              fieldName: "Id",
              sorttype: "DESC"
            });
            break;
          default:
            break;
        }
      }

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
        console.error("Error fetching products by category:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching products by category:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getFeatured() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "featured",
            Operator: "EqualTo",
            Values: [true]
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
        console.error("Error fetching featured products:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching featured products:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getNewArrivals() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "newArrival",
            Operator: "EqualTo",
            Values: [true]
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
        console.error("Error fetching new arrivals:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching new arrivals:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getSaleItems() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ],
        where: [
          {
            FieldName: "discount",
            Operator: "GreaterThan",
            Values: [0]
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
        console.error("Error fetching sale items:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error fetching sale items:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "category",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "Tags",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
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
        console.error("Error searching products:", error?.response?.data?.message);
        throw new Error(error?.response?.data?.message);
      } else {
        console.error("Error searching products:", error.message);
        throw new Error(error.message);
      }
    }
  }

  async getRelatedProducts(productId, limit = 4) {
    try {
      // First get the product to find its category and gender
      const product = await this.getById(productId);
      if (!product) return [];

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "price" } },
          { field: { Name: "originalPrice" } },
          { field: { Name: "discount" } },
          { field: { Name: "images" } },
          { field: { Name: "category" } },
          { field: { Name: "subcategory" } },
          { field: { Name: "gender" } },
          { field: { Name: "sizes" } },
          { field: { Name: "colors" } },
          { field: { Name: "description" } },
          { field: { Name: "inStock" } },
          { field: { Name: "featured" } },
          { field: { Name: "newArrival" } },
          { field: { Name: "Tags" } }
        ],
        whereGroups: [
          {
            operator: "AND",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Id",
                    operator: "NotEqualTo",
                    values: [parseInt(productId)]
                  }
                ],
                operator: "AND"
              },
              {
                conditions: [
                  {
                    fieldName: "category",
                    operator: "EqualTo",
                    values: [product.category]
                  },
                  {
                    fieldName: "gender",
                    operator: "EqualTo",
                    values: [product.gender]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching related products:", error?.response?.data?.message);
        return [];
      } else {
        console.error("Error fetching related products:", error.message);
        return [];
      }
    }
  }
}

export default new ProductService();