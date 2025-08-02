import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import productService from "@/services/api/productService";

const ProductGrid = ({ 
  category = "all", 
  filters = {}, 
  searchQuery = "",
  title = "Products" 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadProducts();
  }, [category, filters, searchQuery, sortBy]);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    
    try {
      let result;
      
      if (searchQuery) {
        result = await productService.search(searchQuery);
      } else {
        result = await productService.getByCategory(category, { 
          ...filters, 
          sortBy 
        });
      }
      
      setProducts(result);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadProducts();
  };

  if (loading) {
    return <Loading type="product-grid" />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={handleRetry}
        type="network"
      />
    );
  }

  if (products.length === 0) {
    return (
      <Empty 
        type={searchQuery ? "search" : "products"}
        action={() => window.location.href = "/products"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : title}
          </h2>
          <p className="text-gray-600 mt-1">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${
                viewMode === "grid" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              } transition-colors`}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list" 
                  ? "bg-primary text-white" 
                  : "bg-white text-gray-600 hover:bg-gray-50"
              } transition-colors`}
            >
              <ApperIcon name="List" size={16} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[140px]"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </Select>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
        layout
      >
        {products.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05 
            }}
          >
            <ProductCard 
              product={product} 
              className={viewMode === "list" ? "flex" : ""}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button (if needed) */}
      {products.length >= 12 && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;