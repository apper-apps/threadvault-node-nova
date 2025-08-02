import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import cartService from "@/services/api/cartService";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadCartCount();
  }, [location]);

  const loadCartCount = async () => {
    try {
      const count = await cartService.getItemCount();
      setCartItemCount(count);
    } catch (error) {
      console.error("Failed to load cart count:", error);
    }
  };

  const navigationItems = [
    { name: "Shop", href: "/products", hasDropdown: true },
    { name: "Men", href: "/products/men" },
    { name: "Women", href: "/products/women" },
    { name: "Accessories", href: "/products/accessories" },
    { name: "New Arrivals", href: "/products/new-arrivals" },
    { name: "Sale", href: "/products/sale" },
  ];

  const handleCartClick = () => {
    navigate("/cart");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-6 h-6 flex items-center justify-center"
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
>
            <h1 className="text-2xl font-display font-bold text-primary">
              Sayan Threads
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar placeholder="Search products..." />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden w-6 h-6 flex items-center justify-center"
            >
              <ApperIcon name="Search" size={20} />
            </button>

            {/* Account Menu */}
            <button className="hidden lg:flex w-6 h-6 items-center justify-center text-gray-700 hover:text-primary transition-colors">
              <ApperIcon name="User" size={20} />
            </button>

            {/* Wishlist */}
            <button className="hidden lg:flex w-6 h-6 items-center justify-center text-gray-700 hover:text-primary transition-colors">
              <ApperIcon name="Heart" size={20} />
            </button>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="relative flex items-center justify-center w-6 h-6 text-gray-700 hover:text-primary transition-colors"
            >
              <ApperIcon name="ShoppingBag" size={20} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden pb-4 overflow-hidden"
            >
              <SearchBar 
                variant="mobile" 
                placeholder="Search products..."
                onSearch={() => setIsSearchOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              <hr className="my-4" />
              
              <div className="space-y-4">
                <Link
                  to="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  <ApperIcon name="User" size={20} />
                  Account
                </Link>
                
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  <ApperIcon name="Heart" size={20} />
                  Wishlist
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;