import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FilterSection from "@/components/molecules/FilterSection";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ProductFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    gender: initialFilters.gender || "all",
    priceRange: initialFilters.priceRange || [0, 500],
    colors: initialFilters.colors || [],
    sizes: initialFilters.sizes || [],
    categories: initialFilters.categories || [],
    ...initialFilters
  });

  const [tempPriceRange, setTempPriceRange] = useState(filters.priceRange);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleGenderChange = (gender) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const handleColorToggle = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSizeToggle = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handlePriceChange = () => {
    setFilters(prev => ({ ...prev, priceRange: tempPriceRange }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      gender: "all",
      priceRange: [0, 500],
      colors: [],
      sizes: [],
      categories: []
    };
    setFilters(clearedFilters);
    setTempPriceRange([0, 500]);
  };

  const genderOptions = [
    { value: "all", label: "All" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "unisex", label: "Unisex" }
  ];

  const colorOptions = [
    { name: "Black", value: "black", color: "#000000" },
    { name: "White", value: "white", color: "#FFFFFF" },
    { name: "Gray", value: "gray", color: "#6B7280" },
    { name: "Blue", value: "blue", color: "#3B82F6" },
    { name: "Red", value: "red", color: "#EF4444" },
    { name: "Green", value: "green", color: "#10B981" },
    { name: "Brown", value: "brown", color: "#A3A3A3" },
    { name: "Navy", value: "navy", color: "#1E293B" }
  ];

  const sizeOptions = [
    "XS", "S", "M", "L", "XL", "XXL",
    "US 6", "US 7", "US 8", "US 9", "US 10", "US 11",
    "28", "30", "32", "34", "36", "38"
  ];

  const hasActiveFilters = 
    filters.gender !== "all" ||
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 500;

  return (
    <div className="w-full max-w-xs bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="font-semibold text-lg">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-accent hover:text-accent-600"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Gender Filter */}
        <FilterSection title="Gender" defaultOpen>
          <div className="space-y-2">
            {genderOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={filters.gender === option.value}
                  onChange={() => handleGenderChange(option.value)}
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range Filter */}
        <FilterSection title="Price Range" defaultOpen>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${tempPriceRange[0]}</span>
              <span>${tempPriceRange[1]}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={tempPriceRange[0]}
                onChange={(e) => setTempPriceRange([parseInt(e.target.value), tempPriceRange[1]])}
                onMouseUp={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={tempPriceRange[1]}
                onChange={(e) => setTempPriceRange([tempPriceRange[0], parseInt(e.target.value)])}
                onMouseUp={handlePriceChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer absolute top-0"
              />
            </div>
          </div>
        </FilterSection>

        {/* Color Filter */}
        <FilterSection title="Colors">
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorToggle(color.name)}
                className={`w-8 h-8 rounded-full border-2 relative ${
                  filters.colors.includes(color.name)
                    ? "border-primary ring-2 ring-primary ring-offset-1"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.color }}
                title={color.name}
              >
                {filters.colors.includes(color.name) && (
                  <ApperIcon
                    name="Check"
                    size={12}
                    className={`absolute inset-0 m-auto ${
                      color.value === "white" ? "text-black" : "text-white"
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Size Filter */}
        <FilterSection title="Sizes">
          <div className="grid grid-cols-3 gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 text-sm border rounded-sm transition-colors ${
                  filters.sizes.includes(size)
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilters;