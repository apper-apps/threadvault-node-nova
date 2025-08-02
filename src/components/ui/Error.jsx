import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "",
  type = "default" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Please check your internet connection and try again."
        };
      case "not-found":
        return {
          icon: "Search",
          title: "Not Found",
          description: "The item you're looking for doesn't seem to exist."
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Oops! Something went wrong",
          description: message
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <ApperIcon 
          name={errorContent.icon} 
          size={32} 
          className="text-error"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {errorContent.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {errorContent.description}
      </p>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          className="flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;