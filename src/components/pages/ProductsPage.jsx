import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import ProductFilters from "@/components/organisms/ProductFilters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import categoryService from "@/services/api/categoryService";

const ProductsPage = () => {
  const { category = "all" } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && category !== "all") {
      loadCategoryData();
    } else {
      setCategoryData(null);
    }
  }, [category]);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getBySlug(category);
      setCategoryData(data);
    } catch (error) {
      console.error("Failed to load category data:", error);
      setCategoryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getCategoryTitle = () => {
    if (searchQuery) {
      return `Search Results`;
    }
    
    if (categoryData) {
      return categoryData.name;
    }

    switch (category) {
      case "men":
        return "Men's Fashion";
      case "women":
        return "Women's Fashion";
      case "accessories":
        return "Accessories";
      case "new-arrivals":
        return "New Arrivals";
      case "sale":
        return "Sale";
      default:
        return "All Products";
    }
  };

  const getCategoryDescription = () => {
    if (searchQuery) return null;
    
    if (categoryData) {
      return categoryData.description;
    }

    switch (category) {
      case "men":
        return "Discover the latest trends in men's fashion";
      case "women":
        return "Explore our curated collection of women's clothing";
      case "accessories":
        return "Complete your look with our accessory collection";
      case "new-arrivals":
        return "Fresh styles just in";
      case "sale":
        return "Don't miss out on these amazing deals";
      default:
        return "Browse our complete collection of premium fashion";
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Category Header */}
      {!searchQuery && categoryData && (
        <div className="relative h-64 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${categoryData.image}')` }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {categoryData.name}
            </h1>
            <p className="text-lg opacity-90">
              {categoryData.description}
            </p>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">{getCategoryTitle()}</span>
        </nav>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters 
                onFiltersChange={handleFiltersChange}
                initialFilters={{ gender: category === "men" || category === "women" ? category : "all" }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Filter" size={16} />
                Filters
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6 bg-white rounded-sm border border-gray-200 overflow-hidden"
              >
                <ProductFilters 
                  onFiltersChange={handleFiltersChange}
                  initialFilters={{ gender: category === "men" || category === "women" ? category : "all" }}
                />
              </motion.div>
            )}

            {/* Product Grid */}
            <ProductGrid
              category={category}
              filters={filters}
              searchQuery={searchQuery}
              title={getCategoryTitle()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;