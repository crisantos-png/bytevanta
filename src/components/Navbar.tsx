
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Byte<span className="text-yellow-500">vanta</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/category/ai" className="hover:text-blue-600">AI</Link>
            <Link to="/category/startups" className="hover:text-blue-600">Startups</Link>
            
            {user ? (
              <>
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>
                <Link to="/admin/dashboard">
                  <Button variant="outline" size="sm">Admin</Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-blue-600">Home</Link>
              <Link to="/category/ai" className="hover:text-blue-600">AI</Link>
              <Link to="/category/startups" className="hover:text-blue-600">Startups</Link>
              
              {user ? (
                <>
                  <Link to="/profile" className="hover:text-blue-600">Profile</Link>
                  <Link to="/admin/dashboard" className="hover:text-blue-600">Admin</Link>
                </>
              ) : (
                <Link to="/auth" className="hover:text-blue-600">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
