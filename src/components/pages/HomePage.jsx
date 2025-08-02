import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import categoryService from "@/services/api/categoryService";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [featured, arrivals, mainCategories] = await Promise.all([
        productService.getFeatured(),
        productService.getNewArrivals(),
        categoryService.getMainCategories()
      ]);
      
      setFeaturedProducts(featured.slice(0, 4));
      setNewArrivals(arrivals.slice(0, 8));
      setCategories(mainCategories);
    } catch (err) {
      setError(err.message || "Failed to load homepage data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="h-96 bg-surface animate-pulse mb-12" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Loading type="product-grid" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message={error}
          onRetry={loadHomeData}
          type="network"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[70vh] bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=800&fit=crop')"
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            SAYAN THREADS
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Experience the artistry of premium threads. Handcrafted collections that weave style with sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/products"
              variant="accent"
              size="xl"
              className="flex items-center gap-2"
            >
              Shop Now
              <ApperIcon name="ArrowRight" size={20} />
            </Button>
            <Button
              as={Link}
              to="/products/new-arrivals"
              variant="secondary"
              size="xl"
              className="bg-white bg-opacity-20 backdrop-blur-sm border-white text-white hover:bg-white hover:text-gray-900"
            >
              New Arrivals
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every style and occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/products/${category.slug}`}
                  className="group block relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-100"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-display font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm opacity-90 mb-3">
                      {category.productCount} Products
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      Shop Now
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked favorites that showcase our commitment to quality and style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button
              as={Link}
              to="/products"
              variant="outline"
              size="lg"
              className="flex items-center gap-2 mx-auto"
            >
              View All Products
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
                New Arrivals
              </h2>
              <p className="text-gray-600">
                Fresh styles just in. Be the first to wear the latest trends.
              </p>
            </div>
            <Link
              to="/products/new-arrivals"
              className="hidden lg:flex items-center gap-2 text-primary hover:text-gray-700 font-medium transition-colors"
            >
              View All
              <ApperIcon name="ArrowRight" size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 lg:hidden">
            <Button
              as={Link}
              to="/products/new-arrivals"
              variant="outline"
              size="lg"
              className="flex items-center gap-2 mx-auto"
            >
              View All New Arrivals
              <ApperIcon name="ArrowRight" size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Stay in Style
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, style tips, and early access to new collections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-sm border-0 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                variant="accent"
                size="lg"
                className="px-8"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;