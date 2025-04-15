
import { Link } from 'react-router-dom';
import SecretAdminButton from './SecretAdminButton';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-bytevanta-blue">
                Byte<span className="text-bytevanta-gold">vanta</span>
              </span>
            </Link>
            <p className="text-gray-300 text-sm">
              The latest in tech news, from artificial intelligence to startups and beyond.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/ai" className="text-gray-300 hover:text-bytevanta-gold transition">
                  AI
                </Link>
              </li>
              <li>
                <Link to="/category/startups" className="text-gray-300 hover:text-bytevanta-gold transition">
                  Startups
                </Link>
              </li>
              <li>
                <Link to="/category/gadgets" className="text-gray-300 hover:text-bytevanta-gold transition">
                  Gadgets
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-bytevanta-gold transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-bytevanta-gold transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-bytevanta-gold transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-bytevanta-gold transition">
                Twitter
              </a>
              <a href="#" className="text-gray-300 hover:text-bytevanta-gold transition">
                LinkedIn
              </a>
              <a href="#" className="text-gray-300 hover:text-bytevanta-gold transition">
                Facebook
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Bytevanta. All rights reserved<SecretAdminButton />
          </p>
          <div className="flex mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 text-sm hover:text-bytevanta-gold transition mr-4">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 text-sm hover:text-bytevanta-gold transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
