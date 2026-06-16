import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, ArrowLeft, ShieldAlert, Award, Truck } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import { ProductSkeleton } from '../components/common/Skeleton';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setActiveImage(0);

        const relData = await api.get(`/products?category=${encodeURIComponent(data.category)}&limit=4`);
        setRelatedProducts(relData.data.products.filter((p) => p._id !== data._id));
      } catch (err) {
        console.error('Error fetching product details, using backup', err);
        const backupProducts = [
          { _id: '1', title: 'Handcrafted Terracotta Clay Water Jug', price: 450, village: 'Pokhran, Rajasthan', rating: 4.8, images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'], category: 'Pottery', stock: 25, description: 'Traditionally baked earthenware water jug made from pure clay. Naturally cools water, enhances taste, and adds a rustic charm to your dining table. Crafted by third-generation potters in Rajasthan.' },
          { _id: '2', title: 'Jaipur Blue Pottery Floral Vase', price: 1250, village: 'Sanganer, Rajasthan', rating: 4.9, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'], category: 'Pottery', stock: 12, description: 'An exquisite hand-painted blue pottery flower vase using quartz clay. Features intricate traditional Persian-floral motifs. A perfect statement piece for modern home decor.' },
          { _id: '3', title: 'Handwoven Khadi Cotton Saree', price: 2400, village: 'Phulia, West Bengal', rating: 4.7, images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'], category: 'Textiles', stock: 8, description: 'Elegantly spun handloom cotton saree dyed in natural indigo vegetable colors. Soft, breathable, and supports sustainable village weavers in West Bengal.' },
          { _id: '4', title: 'Hand-Block Printed Cotton Cushion Covers (Set of 2)', price: 650, village: 'Dhamadka, Gujarat', rating: 4.6, images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'], category: 'Textiles', stock: 30, description: 'Soft organic cotton cushion covers featuring heritage Ajrakh geometric hand-block printing. Indigo and madder red natural dyes make it skin-friendly and rich in aesthetic details.' },
          { _id: '5', title: 'Handcarved Sheesham Wood Elephant', price: 890, village: 'Saharanpur, UP', rating: 4.9, images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'], category: 'Woodwork', stock: 15, description: 'Beautifully detailed elephant figurine handcarved from premium seasoned rosewood (Sheesham) with brass inlay work. Symbolizes wisdom and luck.' },
          { _id: '6', title: 'Handcarved Wooden Kitchen Coasters (Set of 6)', price: 380, village: 'Channapatna, Karnataka', rating: 4.5, images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80'], category: 'Woodwork', stock: 40, description: 'Rustic wooden drink coasters with a carved geometric mandala pattern. Comes with a matching holder. Protects tables and acts as a beautiful table-top accessory.' },
          { _id: '7', title: 'Pure Organic Lakadong Turmeric Powder (250g)', price: 290, village: 'Jaintia Hills, Meghalaya', rating: 4.9, images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'], category: 'Organic Food', stock: 50, description: 'High-curcumin (7-9%) organic turmeric cultivated in the hills of Meghalaya. Known for its intense aroma, bright golden color, and superior medicinal properties.' },
          { _id: '8', title: 'Raw Wild Forest Honey (500g)', price: 480, village: 'Sundarbans, West Bengal', rating: 4.8, images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'], category: 'Organic Food', stock: 35, description: '100% natural, unfiltered wild honey ethically harvested from the Sundarbans forest reserves. Rich in antioxidants and enzymes, with a unique woody flavor profile.' },
          { _id: '9', title: 'Woven Bamboo Cane Utility Storage Basket', price: 720, village: 'Agartala, Tripura', rating: 4.7, images: ['https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=800&q=80'], category: 'Woodwork', stock: 18, description: 'Strong, eco-friendly bamboo storage basket hand-braided by rural artisans. Versatile usage as a fruit basket, laundry basket, or stylish plant-pot holder.' },
        ];

        const match = backupProducts.find((p) => p._id === id);
        if (match) {
          setProduct(match);
          setRelatedProducts(backupProducts.filter((p) => p.category === match.category && p._id !== match._id).slice(0, 3));
        } else {
          toast.error('Product not found in database.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} x ${product.title} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-6">
        <ShieldAlert size={48} className="text-red-500 mx-auto animate-bounce" />
        <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-white">Product Not Found</h2>
        <Link to="/products" className="text-primary dark:text-emerald-400 hover:underline font-semibold flex items-center justify-center space-x-1">
          <ArrowLeft size={16} />
          <span>Back to products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-emerald-400 transition font-semibold"
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="w-full h-[450px] bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-850 rounded-3xl overflow-hidden relative shadow-sm">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 bg-white ${activeImage === i ? 'border-primary dark:border-emerald-500' : 'border-beige/40 dark:border-gray-800'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 font-semibold">
              <span className="bg-primary/10 text-primary dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span>•</span>
              <div className="flex items-center text-amber-500">
                <Star size={14} className="fill-current mr-1" />
                <span className="text-sm text-gray-800 dark:text-gray-200">{product.rating}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>
          </div>

          <div className="bg-beige/40 dark:bg-gray-900 border border-beige-dark/40 dark:border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-brown dark:text-amber-500 shadow-sm">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Village of Origin</h4>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{product.village}</p>
            </div>
          </div>

          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
            ₹{product.price}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light">
            {product.description}
          </p>

          <div className="pt-4 space-y-4 border-t border-beige/20 dark:border-gray-800">
            <div className="flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400 mr-2">Availability:</span>
              {product.stock > 0 ? (
                <span className="text-green-600 dark:text-green-400 font-semibold">In Stock ({product.stock} left)</span>
              ) : (
                <span className="text-red-500 dark:text-red-400 font-semibold">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <Truck size={16} className="text-primary dark:text-emerald-400" />
              <span>Next-day courier delivery available in Delhi NCR.</span>
            </div>

            {product.stock > 0 && (
              <div className="flex space-x-4 items-center">
                <div className="flex items-center bg-beige-light dark:bg-gray-800 rounded-xl p-1.5 border border-beige-dark/20 dark:border-gray-800">
                  <button
                    onClick={() => setQuantity(q => Math.max(q - 1, 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold hover:bg-beige/40 rounded-lg text-gray-750 dark:text-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(q + 1, product.stock))}
                    className="w-10 h-10 flex items-center justify-center font-bold hover:bg-beige/40 rounded-lg text-gray-750 dark:text-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition duration-250 shadow-md transform hover:scale-[1.01]"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="space-y-8 border-t border-beige/25 dark:border-gray-800 pt-16">
          <h2 className="text-2xl font-bold font-display text-primary dark:text-emerald-400">Related Creations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((prod) => (
              <div
                key={prod._id}
                className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-beige/40 dark:border-gray-800 p-4 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative mb-4">
                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{prod.category}</span>
                    <Link to={`/products/${prod._id}`} onClick={() => window.scrollTo(0, 0)} className="block">
                      <h4 className="font-semibold text-gray-800 dark:text-white hover:text-primary dark:hover:text-emerald-400 transition line-clamp-1">
                        {prod.title}
                      </h4>
                    </Link>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-beige/15 dark:border-gray-800">
                  <span className="font-bold text-gray-900 dark:text-white">₹{prod.price}</span>
                  <Link
                    to={`/products/${prod._id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-sm font-semibold text-primary hover:underline dark:text-emerald-400"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
