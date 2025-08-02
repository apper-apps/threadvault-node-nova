import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import cartService from "@/services/api/cartService";

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      loadCartData();
    }
  }, [isOpen]);

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
    onClose();
  };

  const handleViewCart = () => {
    navigate("/cart");
    onClose();
  };

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {loading ? (
                <div className="p-4">
                  <Loading type="cart" />
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <Empty 
                    type="cart"
                    action={() => {
                      navigate("/products");
                      onClose();
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

                  {/* Summary */}
                  <div className="border-t border-gray-100 p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>
                          {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={handleCheckout}
                        variant="accent"
                        size="lg"
                        className="w-full"
                      >
                        Proceed to Checkout
                      </Button>
                      <Button
                        onClick={handleViewCart}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        View Full Cart
                      </Button>
                    </div>

                    {shipping > 0 && (
                      <p className="text-sm text-gray-600 text-center">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;