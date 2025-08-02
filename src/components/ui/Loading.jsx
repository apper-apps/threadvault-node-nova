import { motion } from "framer-motion";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "product-grid") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-sm overflow-hidden">
            <div className="aspect-square bg-surface animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-surface animate-pulse rounded-sm" />
              <div className="h-4 bg-surface animate-pulse rounded-sm w-3/4" />
              <div className="h-6 bg-surface animate-pulse rounded-sm w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "product-detail") {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${className}`}>
        <div className="space-y-4">
          <div className="aspect-square bg-surface animate-pulse rounded-sm" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square bg-surface animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-surface animate-pulse rounded-sm" />
          <div className="h-6 bg-surface animate-pulse rounded-sm w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-surface animate-pulse rounded-sm" />
            <div className="h-4 bg-surface animate-pulse rounded-sm w-5/6" />
            <div className="h-4 bg-surface animate-pulse rounded-sm w-4/6" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-surface animate-pulse rounded-sm w-1/4" />
            <div className="h-12 bg-surface animate-pulse rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "cart") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex gap-4 p-4 bg-white rounded-sm">
            <div className="w-20 h-20 bg-surface animate-pulse rounded-sm" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface animate-pulse rounded-sm" />
              <div className="h-4 bg-surface animate-pulse rounded-sm w-3/4" />
              <div className="h-4 bg-surface animate-pulse rounded-sm w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;