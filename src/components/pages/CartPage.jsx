import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import cartService from "@/services/api/cartService";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    setLoading(true);
    try {
      const [items, total] = await Promise.all([
        cartService.getItems(),
        cartService.getSubtotal()
      ]);
      setCartItems(items);
      setSubtotal(total);
    } catch (error) {
      console.error("Failed to load cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 animate-pulse rounded-sm mb-8 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Loading type="cart" />
            </div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Shopping Cart
          </h1>
          <Link
            to="/products"
            className="flex items-center gap-2 text-primary hover:text-gray-700 font-medium transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <Empty 
              type="cart"
              action={() => navigate("/products")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Cart Items ({cartItems.length})
                </h2>
                
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.Id}
                        item={item}
                        onUpdate={loadCartData}
                        onRemove={loadCartData}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-white rounded-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  You might also like
                </h3>
                <p className="text-gray-600 text-sm">
                  Recommended products feature coming soon!
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-sm p-6 sticky top-24"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-success font-medium">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="accent"
                  size="lg"
                  className="w-full mb-4"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  as={Link}
                  to="/products"
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Continue Shopping
                </Button>

                {shipping > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-sm">
                    <p className="text-sm text-blue-800 font-medium">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ApperIcon name="Shield" size={16} className="text-success" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ApperIcon name="RotateCcw" size={16} className="text-success" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <ApperIcon name="Truck" size={16} className="text-success" />
                    <span>Fast delivery</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;