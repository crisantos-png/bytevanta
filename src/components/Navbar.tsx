
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-bytevanta-blue">
                Byte<span className="text-bytevanta-gold">vanta</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-bytevanta-blue font-medium">Home</Link>
            <Link to="/category/ai" className="text-gray-700 hover:text-bytevanta-blue font-medium">AI</Link>
            <Link to="/category/startups" className="text-gray-700 hover:text-bytevanta-blue font-medium">Startups</Link>
            <Link to="/category/gadgets" className="text-gray-700 hover:text-bytevanta-blue font-medium">Gadgets</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={toggleMenu} size="icon">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-bytevanta-blue font-medium py-2">Home</Link>
              <Link to="/category/ai" className="text-gray-700 hover:text-bytevanta-blue font-medium py-2">AI</Link>
              <Link to="/category/startups" className="text-gray-700 hover:text-bytevanta-blue font-medium py-2">Startups</Link>
              <Link to="/category/gadgets" className="text-gray-700 hover:text-bytevanta-blue font-medium py-2">Gadgets</Link>
              <Link to="/admin" className="text-gray-700 hover:text-bytevanta-blue font-medium py-2">Admin</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
