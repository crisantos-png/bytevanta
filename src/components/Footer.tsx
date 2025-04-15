
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-bytevanta-blue">
                Byte<span className="text-bytevanta-gold">vanta</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400">
              Your trusted source for the latest technology news, reviews, and insights.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-bytevanta-silver pb-2">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/ai" className="text-gray-400 hover:text-bytevanta-blue transition">AI</Link></li>
              <li><Link to="/category/startups" className="text-gray-400 hover:text-bytevanta-blue transition">Startups</Link></li>
              <li><Link to="/category/gadgets" className="text-gray-400 hover:text-bytevanta-blue transition">Gadgets</Link></li>
              <li><Link to="/category/apps" className="text-gray-400 hover:text-bytevanta-blue transition">Apps</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-bytevanta-silver pb-2">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-bytevanta-blue transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-bytevanta-blue transition">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-bytevanta-blue transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-bytevanta-blue transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Bytevanta. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-gray-400 text-sm">
              Designed with <span className="text-bytevanta-red">♥</span> by Bytevanta Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
