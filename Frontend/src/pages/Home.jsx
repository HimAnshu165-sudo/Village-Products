import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Users } from 'lucide-react';
import api from '../services/api';
import { ProductSkeleton } from '../components/common/Skeleton';

const categories = [
  { name: 'Pottery', desc: 'Earthenware & clay art', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80' },
  { name: 'Textiles', desc: 'Handloom sarees & prints', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Woodwork', desc: 'Carved rosewood & toys', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80' },
  { name: 'Organic Food', desc: 'Himalayan honey & spices', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
];

const testimonials = [
  { name: 'Aarav Sharma', role: 'Vasant Kunj, Delhi', text: 'The terracotta water jug cools water perfectly and looks stunning on my dining table. Excellent packaging too!', rating: 5 },
  { name: 'Priya Iyer', role: 'Dwarka, Delhi', text: 'Beautiful handwoven cotton saree. The texture is so soft and breathable. Direct support to weavers makes it special.', rating: 5 },
  { name: 'Vikram Malhotra', role: 'South Ext, Delhi', text: 'Got the wooden coasters and elephant figurine. Exquisite craftsmanship. Highly recommended for premium gifts.', rating: 5 },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?limit=4');
        setFeaturedProducts(data.products);
      } catch (err) {
        console.error('Error fetching products, using seeds backup', err);
        setFeaturedProducts([
          { _id: '1', title: 'Jaipur Blue Pottery Floral Vase', price: 1250, village: 'Sanganer, Rajasthan', rating: 4.9, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'], category: 'Pottery' },
          { _id: '2', title: 'Handwoven Khadi Cotton Saree', price: 2400, village: 'Phulia, West Bengal', rating: 4.7, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'], category: 'Textiles' },
          { _id: '3', title: 'Handcarved Sheesham Wood Elephant', price: 890, village: 'Saharanpur, UP', rating: 4.9, images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'], category: 'Woodwork' },
          { _id: '4', title: 'Pure Organic Lakadong Turmeric', price: 290, village: 'Jaintia Hills, Meghalaya', rating: 4.9, images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'], category: 'Organic Food' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(45, 106, 79, 0.45), rgba(27, 67, 50, 0.85)), url('https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=1600&q=80')` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-beige-light dark:from-gray-950 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block bg-beige/25 border border-beige/40 text-beige-light font-medium text-sm px-4 py-1.5 rounded-full backdrop-blur-md"
          >
            Direct From India's Villages to Delhi Homes
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-extrabold text-white leading-tight font-display"
          >
            Bring Home the Rich Soul of <span className="text-beige dark:text-amber-400">Rural Craftsmanship</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-beige-light/90 max-w-3xl mx-auto font-light"
          >
            Ethically sourced terracotta, handloom cotton, rosewood crafts, and pure organic honey. Empowering rural artisans while delivering timeless heritage to Connaught Place, Dwarka, South Ext, and all of Delhi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-4"
          >
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-brown hover:bg-brown-dark text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition duration-300 transform hover:scale-105"
            >
              <span>Explore Rural Treasures</span>
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display text-primary dark:text-emerald-400">Shop by Heritage Category</h2>
          <p className="text-gray-500 dark:text-gray-400">Carefully curated selections showcasing diverse regional art forms</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -6 }}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md cursor-pointer border border-beige/40 dark:border-gray-800"
            >
              <Link to={`/products?category=${encodeURIComponent(cat.name)}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent z-10"></div>
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute bottom-6 left-6 z-20 space-y-1">
                  <h3 className="text-xl font-bold text-white font-display">{cat.name}</h3>
                  <p className="text-xs text-beige-light/80">{cat.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-display text-primary dark:text-emerald-400">Featured Creations</h2>
            <p className="text-gray-500 dark:text-gray-400">Hand-selected best sellers bought by customers in Delhi this week</p>
          </div>
          <Link to="/products" className="text-primary hover:text-primary-dark dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold flex items-center space-x-1 group">
            <span>View All</span>
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <motion.div
                key={prod._id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-beige/40 dark:border-gray-800 p-4 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-56 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative mb-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-beige/95 dark:bg-gray-900/95 text-brown dark:text-amber-500 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      {prod.village.split(',')[0]}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span>{prod.category}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center text-amber-500">
                        <Star size={12} className="fill-current mr-0.5" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>

                    <Link to={`/products/${prod._id}`} className="block">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-emerald-400 transition line-clamp-1">
                        {prod.title}
                      </h3>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-beige/20 dark:border-gray-800 flex-wrap">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{prod.price}</span>
                  <Link
                    to={`/products/${prod._id}`}
                    className="inline-flex items-center justify-center p-2.5 bg-primary/10 text-primary dark:text-emerald-400 dark:bg-emerald-500/10 rounded-xl hover:bg-primary hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition duration-200"
                  >
                    <ShoppingBag size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-primary/5 dark:bg-emerald-950/10 rounded-[40px] p-8 md:p-16 border border-primary/10 dark:border-emerald-500/10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brown dark:text-amber-500">Connecting Communities</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-primary dark:text-emerald-400">Our Mission: Bridging Village Artisans & Delhi Consumers</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              Indian village crafts have sustained communities for generations, yet rural creators struggle with direct market access. GramSetu acts as a direct digital bridge ("Setu") connecting remote villages with the vibrant households of Delhi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-beige/40 text-primary dark:text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">100% Genuine Crafts</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Directly sourced, no middlemen markups.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-beige/40 text-brown dark:text-amber-500">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">Empowering Livelihoods</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Artisans retain 80%+ of sale proceeds.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[32px]"></div>
            <img
              src="https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=800&q=80"
              alt="Artisan at work"
              className="w-full h-[400px] object-cover rounded-[32px] shadow-lg border border-beige/40 dark:border-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display text-primary dark:text-emerald-400">Loved by Delhi Buyers</h2>
          <p className="text-gray-500 dark:text-gray-400">Hear what customers in South Ext, Connaught Place, and Dwarka say about their purchases</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex text-amber-500">
                  {[...Array(test.rating)].map((_, idx) => (
                    <Star key={idx} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic font-light">"{test.text}"</p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-beige/20 dark:border-gray-800">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold dark:bg-emerald-500/10 dark:text-emerald-400">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{test.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
