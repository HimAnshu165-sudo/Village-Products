import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-dark dark:bg-gray-950 text-beige-light dark:text-gray-400 border-t border-primary/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              Gram<span className="text-beige dark:text-amber-500">Setu</span>
            </h3>
            <p className="text-sm text-beige/80 dark:text-gray-400 max-w-sm">
              Bridging the gap between India's traditional village artisans and urban households. We deliver verified, ethically-sourced, handcrafted heritage products straight to your doorstep in Delhi.
            </p>
            <div className="text-xs text-beige/60 dark:text-gray-500">
              © {new Date().getFullYear()} GramSetu. Made with ❤️ for Indian Heritage.
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-beige dark:hover:text-amber-500 transition">
                  Handicrafts & Pottery
                </Link>
              </li>
              <li>
                <Link to="/products?category=Textiles" className="hover:text-beige dark:hover:text-amber-500 transition">
                  Handloom Textiles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Woodwork" className="hover:text-beige dark:hover:text-amber-500 transition">
                  Wooden Toys & Crafts
                </Link>
              </li>
              <li>
                <Link to="/products?category=Organic+Food" className="hover:text-beige dark:hover:text-amber-500 transition">
                  Organic Food & Spices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Contact Delhi Office</h4>
            <ul className="space-y-2 text-sm text-beige/80 dark:text-gray-400">
              <li>Connaught Place, New Delhi, 110001</li>
              <li>Email: contact@gramsetu.com</li>
              <li>Phone: +91 11 2345 6789</li>
              <li className="pt-2">
                <span className="inline-block bg-primary text-xs font-semibold px-2 py-1 rounded text-white dark:bg-emerald-700">
                  Delhi Hub Delivery
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-beige/10 dark:border-gray-800 text-center text-xs text-beige/40 dark:text-gray-600">
          Crafted by rural artisans from Pokhran, Saharanpur, Phulia, Dhamadka, Channapatna, and the Jaintia Hills.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
