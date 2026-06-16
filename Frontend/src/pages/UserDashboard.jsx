import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Mail, User, Shield, Package, Calendar } from 'lucide-react';
import api from '../services/api';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.warn('Backend orders fetch failed, showing portfolio mock orders...', err);
        setOrders([
          {
            _id: 'ord_1',
            createdAt: new Date().toISOString(),
            totalPrice: 1340,
            status: 'processing',
            shippingAddress: 'Flat 4B, Pocket A-1, Sector 8, Dwarka, New Delhi - 110075',
            products: [
              {
                product: {
                  title: 'Jaipur Blue Pottery Floral Vase',
                  price: 1250,
                  images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80'],
                  village: 'Sanganer, Rajasthan',
                },
                quantity: 1,
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400';
      case 'processing':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="bg-primary/5 dark:bg-emerald-950/10 border border-primary/10 dark:border-emerald-500/10 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-primary dark:text-emerald-400">
            Namaste, {user?.name}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Track your orders of handcrafted creations and support rural weavers.
          </p>
        </div>
        <span className="bg-primary text-white dark:bg-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          {user?.role} Profile
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-display text-lg font-bold text-gray-800 dark:text-white pb-3 border-b border-beige/25 dark:border-gray-800">
            Account Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <User size={18} className="text-primary dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">FULL NAME</p>
                <p className="font-medium text-gray-800 dark:text-white">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Mail size={18} className="text-primary dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">EMAIL ADDRESS</p>
                <p className="font-medium text-gray-800 dark:text-white">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <Shield size={18} className="text-primary dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">ACCOUNT ROLE</p>
                <p className="font-medium text-gray-800 dark:text-white capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-300">
              <MapPin size={18} className="text-primary dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">DELIVERY ZONE</p>
                <p className="font-medium text-gray-700 dark:text-white">Delhi Hub (NCR Delivery)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold font-display text-gray-800 dark:text-white flex items-center space-x-2">
            <Package size={20} className="text-primary dark:text-emerald-400" />
            <span>Order History</span>
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 text-sm">You haven't placed any orders yet.</p>
              <Link
                to="/products"
                className="inline-block bg-primary hover:bg-primary-dark dark:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-beige/15 dark:border-gray-800 gap-2">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">ID: {order._id}</span>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                              {item.product?.title || 'Unknown Creation'}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity} • {item.product?.village || 'Unknown Village'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                          ₹{(item.product?.price || 0) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-beige/15 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span className="line-clamp-1 max-w-sm sm:max-w-md">{order.shippingAddress}</span>
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 dark:text-white shrink-0">
                      Total: ₹{order.totalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
