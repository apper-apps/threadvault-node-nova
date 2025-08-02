import { useSearchParams } from "react-router-dom";
import ProductGrid from "@/components/organisms/ProductGrid";
import ApperIcon from "@/components/ApperIcon";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <ApperIcon name="ChevronRight" size={14} />
          <span className="text-gray-900 font-medium">Search Results</span>
        </nav>

        {/* Search Results */}
        <ProductGrid
          searchQuery={query}
          title={`Search Results for "${query}"`}
        />
      </div>
    </div>
  );
};

export default SearchPage;