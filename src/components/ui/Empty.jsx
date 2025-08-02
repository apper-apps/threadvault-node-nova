import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing to see here", 
  description = "It looks like there's nothing here yet.",
  action,
  actionLabel = "Get Started",
  icon = "Package",
  className = "",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "cart":
        return {
          icon: "ShoppingBag",
          title: "Your cart is empty",
          description: "Looks like you haven't added anything to your cart yet. Start shopping to fill it up!",
          actionLabel: "Start Shopping"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "We couldn't find any products matching your search. Try different keywords or browse our categories.",
          actionLabel: "Browse Categories"
        };
      case "products":
        return {
          icon: "Package",
          title: "No products available",
          description: "We're currently updating our inventory. Check back soon for new arrivals!",
          actionLabel: "View All Products"
        };
      case "favorites":
        return {
          icon: "Heart",
          title: "No favorites yet",
          description: "Start building your wishlist by adding products you love to your favorites.",
          actionLabel: "Browse Products"
        };
      default:
        return {
          icon: icon,
          title: title,
          description: description,
          actionLabel: actionLabel
        };
    }
  };

  const emptyContent = getEmptyContent();

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={emptyContent.icon} 
          size={40} 
          className="text-gray-400"
        />
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">
        {emptyContent.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {emptyContent.description}
      </p>
      
      {action && (
        <Button 
          onClick={action}
          variant="primary"
          size="lg"
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowRight" size={16} />
          {emptyContent.actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;