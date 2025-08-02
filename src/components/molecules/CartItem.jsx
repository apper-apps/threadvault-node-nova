import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import cartService from "@/services/api/cartService";

const CartItem = ({ item, onUpdate, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await cartService.updateQuantity(item.Id, newQuantity);
      onUpdate();
      toast.success("Cart updated");
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await cartService.removeItem(item.Id);
      onRemove();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      layout
      className="flex gap-4 p-4 bg-white border border-gray-100 rounded-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Product Image */}
      <div className="w-20 h-20 bg-surface rounded-sm overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        
        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
          <span>Size: {item.size}</span>
          <span>Color: {item.color}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-8 h-8 p-0"
            >
              <ApperIcon name="Minus" size={14} />
            </Button>
            
            <span className="w-8 text-center font-medium">
              {item.quantity}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 p-0"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-display font-bold text-lg">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.quantity > 1 && (
              <div className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-error transition-colors disabled:opacity-50"
      >
        <ApperIcon name="Trash2" size={16} />
      </button>
    </motion.div>
  );
};

export default CartItem;