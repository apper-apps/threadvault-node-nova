import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import ProductImageGallery from "@/components/molecules/ProductImageGallery";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import productService from "@/services/api/productService";
import cartService from "@/services/api/cartService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [productData, related] = await Promise.all([
        productService.getById(id),
        productService.getRelatedProducts(id)
      ]);
      
      setProduct(productData);
      setRelatedProducts(related);
      
      // Set default selections
      setSelectedSize(productData.sizes[0] || "");
      setSelectedColor(productData.colors[0] || "");
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setAddingToCart(true);
    
    try {
      await cartService.addItem(product, {
        size: selectedSize,
        color: selectedColor,
        quantity: quantity
      });
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (!error) {
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading type="product-detail" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Error 
          message={error || "Product not found"}
          onRetry={loadProductData}
          type="not-found"
        />
      </div>
    );
  }
const discountedPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
<nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ApperIcon name="ChevronRight" size={14} />
          <a href="/products" className="hover:text-primary transition-colors">Products</a>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium capitalize">{product.category}</span>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium truncate">{product.Name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductImageGallery 
              images={product.images} 
              productName={product.name}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Product Title & Badges */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
{product.Name}
                  </h1>
                  <p className="text-gray-600 capitalize">
                    {product.category} • {product.subcategory}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  {product.discount > 0 && (
                    <Badge variant="sale">
                      -{product.discount}%
                    </Badge>
                  )}
                  {product.newArrival && (
                    <Badge variant="success">
                      New
                    </Badge>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-display font-bold text-accent">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-display font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Size</h3>
              <div className="grid grid-cols-4 gap-2">
                {(Array.isArray(product.sizes) ? product.sizes : [product.sizes]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 text-sm font-medium border rounded-sm transition-all ${
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Color: <span className="font-normal text-gray-600">{selectedColor}</span>
              </h3>
              <div className="flex gap-3">
                {(Array.isArray(product.colors) ? product.colors : [product.colors]).map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                     color.toLowerCase() === 'black' ? '#000000' :
                                     color.toLowerCase() === 'gray' ? '#6b7280' :
                                     color.toLowerCase() === 'blue' ? '#3b82f6' :
                                     color.toLowerCase() === 'red' ? '#ef4444' :
                                     '#6b7280'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
                <span className="w-16 text-center font-medium text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ApperIcon name="Plus" size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-6">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                loading={addingToCart}
                disabled={!product.inStock}
                className="w-full flex items-center justify-center gap-2"
              >
                {!product.inStock ? "Out of Stock" : "Add to Cart"}
                <ApperIcon name="ShoppingCart" size={18} />
              </Button>

              <Button
                onClick={handleBuyNow}
                variant="accent"
                size="lg"
                disabled={!product.inStock || addingToCart}
                className="w-full"
              >
                Buy Now
              </Button>

              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => toast.info("Wishlist feature coming soon!")}
                >
                  <ApperIcon name="Heart" size={18} />
                  Add to Wishlist
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => toast.info("Share feature coming soon!")}
                >
                  <ApperIcon name="Share2" size={18} />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="Truck" size={16} />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="RotateCcw" size={16} />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="Shield" size={16} />
                <span>Secure payment</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">
              You Might Also Like
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.Id} 
                  product={relatedProduct} 
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;