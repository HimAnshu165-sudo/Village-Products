import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { ProductSkeleton } from '../components/common/Skeleton';

const categories = ['Pottery', 'Textiles', 'Woodwork', 'Organic Food'];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: 6,
        });

        if (keyword) queryParams.append('keyword', keyword);
        if (selectedCategory) queryParams.append('category', selectedCategory);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (sort) queryParams.append('sort', sort);

        const { data } = await api.get(`/products?${queryParams.toString()}`);
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) {
        console.error('Error fetching catalog, using backup data', err);
        const backupProducts = [
          { _id: '1', title: 'Handcrafted Terracotta Clay Water Jug', price: 450, village: 'Pokhran, Rajasthan', rating: 4.8, images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'], category: 'Pottery', stock: 25 },
          { _id: '2', title: 'Jaipur Blue Pottery Floral Vase', price: 1250, village: 'Sanganer, Rajasthan', rating: 4.9, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80'], category: 'Pottery', stock: 12 },
          { _id: '3', title: 'Handwoven Khadi Cotton Saree', price: 2400, village: 'Phulia, West Bengal', rating: 4.7, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'], category: 'Textiles', stock: 8 },
          { _id: '4', title: 'Hand-Block Printed Cotton Cushion Covers (Set of 2)', price: 650, village: 'Dhamadka, Gujarat', rating: 4.6, images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'], category: 'Textiles', stock: 30 },
          { _id: '5', title: 'Handcarved Sheesham Wood Elephant', price: 890, village: 'Saharanpur, UP', rating: 4.9, images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'], category: 'Woodwork', stock: 15 },
          { _id: '6', title: 'Handcarved Wooden Kitchen Coasters (Set of 6)', price: 380, village: 'Channapatna, Karnataka', rating: 4.5, images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80'], category: 'Woodwork', stock: 40 },
          { _id: '7', title: 'Pure Organic Lakadong Turmeric Powder (250g)', price: 290, village: 'Jaintia Hills, Meghalaya', rating: 4.9, images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'], category: 'Organic Food', stock: 50 },
          { _id: '8', title: 'Raw Wild Forest Honey (500g)', price: 480, village: 'Sundarbans, West Bengal', rating: 4.8, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'], category: 'Organic Food', stock: 35 },
          { _id: '9', title: 'Woven Bamboo Cane Utility Storage Basket', price: 720, village: 'Agartala, Tripura', rating: 4.7, images: ['https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=600&q=80'], category: 'Woodwork', stock: 18 },
        ];

        let filtered = [...backupProducts];
        if (keyword) {
          filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()) || p.village.toLowerCase().includes(keyword.toLowerCase()));
        }
        if (selectedCategory) {
          filtered = filtered.filter(p => p.category === selectedCategory);
        }
        if (minPrice) {
          filtered = filtered.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
          filtered = filtered.filter(p => p.price <= Number(maxPrice));
        }
        if (sort) {
          if (sort === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
          else if (sort === 'priceDesc') filtered.sort((a, b) => b.price - a.price);
          else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
        }

        const itemsPerPage = 6;
        setTotal(filtered.length);
        setPages(Math.ceil(filtered.length / itemsPerPage));
        setProducts(filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, keyword, selectedCategory, minPrice, maxPrice, sort]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ keyword, category: selectedCategory, minPrice, maxPrice, sort });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setPage(1);
    setSearchParams({});
  };

  const selectCategoryFilter = (cat) => {
    const newCat = selectedCategory === cat ? '' : cat;
    setSelectedCategory(newCat);
    setPage(1);
    setSearchParams({ keyword, category: newCat, minPrice, maxPrice, sort });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-bold font-display text-primary dark:text-emerald-400 animate-fade-in">Rural Marketplace</h1>
        <p className="text-gray-500 dark:text-gray-400">Discover and buy authenticated heritage products directly from artisans.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:flex-grow">
          <input
            type="text"
            placeholder="Search by product, village, or artisan..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-beige-dark/50 dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:focus:ring-emerald-500 transition shadow-sm text-sm text-gray-800 dark:text-gray-100"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
        </form>

        <div className="flex gap-3 w-full md:w-auto shrink-0 justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white dark:bg-gray-900 border border-beige-dark/50 dark:border-gray-800 hover:bg-beige/25 px-5 py-3.5 rounded-2xl transition shadow-sm text-sm font-semibold"
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>

          {(selectedCategory || minPrice || maxPrice || sort || keyword) && (
            <button
              onClick={handleClearFilters}
              className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className={`space-y-6 lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-beige/40 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-beige/20 dark:border-gray-800">
              Filter Options
            </h3>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</h4>
              <div className="flex flex-col space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => selectCategoryFilter(cat)}
                    className={`text-left text-sm py-2 px-3 rounded-xl transition duration-150 ${selectedCategory === cat ? 'bg-primary text-white font-medium dark:bg-emerald-600' : 'text-gray-600 hover:bg-beige/40 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price (₹)</h4>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none w-full text-center text-gray-800 dark:text-gray-100"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none w-full text-center text-gray-800 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sort By</h4>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
              >
                <option value="">Newest</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <button
              onClick={() => {
                setPage(1);
                setSearchParams({ keyword, category: selectedCategory, minPrice, maxPrice, sort });
              }}
              className="w-full bg-primary dark:bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-dark dark:hover:bg-emerald-700 transition duration-200 text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-16 text-center space-y-4 shadow-sm">
              <div className="text-gray-400 text-5xl">🌾</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 font-display">No Products Found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
                We couldn't find any products matching your active search filters. Try updating your price range or selecting another category.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 transition"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <motion.div
                    key={prod._id}
                    layout
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-beige/40 dark:border-gray-800 p-4 relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-52 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative mb-4">
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

              {pages > 1 && (
                <div className="flex justify-center items-center space-x-4 pt-6">
                  <button
                    onClick={() => setPage(p => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl border border-beige-dark/50 dark:border-gray-800 disabled:opacity-50 hover:bg-beige/20 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Page {page} of {pages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(p + 1, pages))}
                    disabled={page === pages}
                    className="p-2.5 rounded-xl border border-beige-dark/50 dark:border-gray-800 disabled:opacity-50 hover:bg-beige/20 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
