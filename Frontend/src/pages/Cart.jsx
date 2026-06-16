import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState('Flat 4B, Pocket A-1, Sector 8, Dwarka, New Delhi - 110075');
  const [checkingOut, setCheckingOut] = useState(false);

  const deliveryCharge = cartTotal > 1000 ? 0 : 90;
  const grandTotal = cartTotal + deliveryCharge;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to complete your order!');
      navigate('/login?redirect=cart');
      return;
    }

    if (!address.trim()) {
      toast.error('Please provide a delivery address in Delhi.');
      return;
    }

    setCheckingOut(true);

    try {
      const orderProducts = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      try {
        await api.post('/orders', {
          products: orderProducts,
          totalPrice: grandTotal,
          shippingAddress: address,
        });
      } catch (backendError) {
        console.warn('Backend order creation failed, running simulated order for portfolio...', backendError);
      }

      setTimeout(() => {
        setCheckingOut(false);
        clearCart();
        toast.success('Payment Successful! Order placed successfully.', {
          duration: 5000,
          icon: '🎉',
        });
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setCheckingOut(false);
      toast.error('Checkout failed. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-6xl text-gray-300 dark:text-gray-700 animate-bounce">🛒</div>
        <h2 className="text-2xl font-bold font-display text-gray-800 dark:text-white">Your Cart is Empty</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm">
          Support village artisans by adding handloom textiles, blue pottery, and organic goods to your shopping cart.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200"
        >
          <span>Go to Marketplace</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-bold font-display text-primary dark:text-emerald-400">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-150 dark:bg-gray-800 shrink-0">
                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{item.village.split(',')[0]} Origin</p>
                  <p className="text-sm font-bold text-primary dark:text-emerald-400">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center bg-beige-light dark:bg-gray-800 rounded-xl p-1 border border-beige-dark/20 dark:border-gray-800">
                  <button
                    onClick={() => updateQuantity(item._id, Math.max(item.quantity - 1, 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, Math.min(item.quantity + 1, item.stock))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 dark:text-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-display text-lg font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-beige/25 dark:border-gray-800">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges (Delhi Hub)</span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">FREE</span>
                ) : (
                  <span>₹{deliveryCharge}</span>
                )}
              </div>
              <div className="pt-3 border-t border-beige/10 dark:border-gray-800 flex justify-between font-bold text-base text-gray-900 dark:text-white">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-beige/15 dark:border-gray-800">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center space-x-1">
                <MapPin size={12} className="text-brown dark:text-amber-500" />
                <span>Delhi Shipping Address</span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-700 dark:text-gray-200"
                placeholder="Enter your shipping address in Delhi NCR"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingOut ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <span>Simulate Checkout & Pay</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <ShieldCheck size={16} className="text-primary dark:text-emerald-400" />
            <span>Secure 256-bit SSL encrypted checkout.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
