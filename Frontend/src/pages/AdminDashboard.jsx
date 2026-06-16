import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, Users, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentProductId, setCurrentProductId] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pottery');
  const [images, setImages] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [village, setVillage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/orders/stats');
      setStats({
        totalSales: statsRes.data.totalSales,
        totalOrders: statsRes.data.totalOrders,
        totalProducts: statsRes.data.totalProducts,
        totalUsers: statsRes.data.totalUsers,
      });

      const prodRes = await api.get('/products?limit=100');
      setProducts(prodRes.data.products);

      const orderRes = await api.get('/orders');
      setOrders(orderRes.data);
    } catch (err) {
      console.warn('Backend admin fetch failed, setting mock portfolio data...', err);
      setStats({
        totalSales: 13400,
        totalOrders: 8,
        totalProducts: 9,
        totalUsers: 14,
      });

      setProducts([
        { _id: '1', title: 'Handcrafted Terracotta Clay Water Jug', price: 450, stock: 25, village: 'Pokhran, Rajasthan', category: 'Pottery', images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=100&q=80'] },
        { _id: '2', title: 'Jaipur Blue Pottery Floral Vase', price: 1250, stock: 12, village: 'Sanganer, Rajasthan', category: 'Pottery', images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=100&q=80'] },
        { _id: '3', title: 'Handwoven Khadi Cotton Saree', price: 2400, stock: 8, village: 'Phulia, West Bengal', category: 'Textiles', images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80'] },
      ]);

      setOrders([
        {
          _id: 'ord_1',
          createdAt: new Date().toISOString(),
          totalPrice: 1340,
          status: 'processing',
          shippingAddress: 'Flat 4B, Pocket A-1, Sector 8, Dwarka, New Delhi - 110075',
          user: { name: 'Delhi Customer', email: 'delhi.buyer@gmail.com' },
          products: [
            {
              product: { title: 'Jaipur Blue Pottery Floral Vase', price: 1250, village: 'Sanganer, Rajasthan' },
              quantity: 1,
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setModalType('add');
    setTitle('');
    setDescription('');
    setCategory('Pottery');
    setImages('');
    setPrice('');
    setStock('');
    setVillage('');
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setModalType('edit');
    setCurrentProductId(prod._id);
    setTitle(prod.title);
    setDescription(prod.description || '');
    setCategory(prod.category);
    setImages(prod.images.join(', '));
    setPrice(prod.price);
    setStock(prod.stock);
    setVillage(prod.village);
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !stock || !village || !images) {
      toast.error('Please fill in required fields.');
      return;
    }

    const imageArray = images.split(',').map((img) => img.trim()).filter(Boolean);
    const productData = {
      title,
      description,
      category,
      images: imageArray,
      price: Number(price),
      stock: Number(stock),
      village,
    };

    try {
      if (modalType === 'add') {
        try {
          await api.post('/products', productData);
          toast.success('Product added successfully!');
        } catch {
          const newMock = {
            _id: Date.now().toString(),
            ...productData,
          };
          setProducts([newMock, ...products]);
          toast.success('Simulated: Product added successfully!');
        }
      } else {
        try {
          await api.put(`/products/${currentProductId}`, productData);
          toast.success('Product updated successfully!');
        } catch {
          setProducts(products.map((p) => (p._id === currentProductId ? { ...p, ...productData } : p)));
          toast.success('Simulated: Product updated successfully!');
        }
      }
      setShowProductModal(false);
      fetchData();
    } catch (err) {
      toast.error('Operation failed.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        try {
          await api.delete(`/products/${id}`);
          toast.success('Product deleted.');
        } catch {
          setProducts(products.filter((p) => p._id !== id));
          toast.success('Simulated: Product deleted.');
        }
        fetchData();
      } catch (err) {
        toast.error('Deletion failed.');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      try {
        await api.put(`/orders/${orderId}/status`, { status: newStatus });
        toast.success(`Order status updated to ${newStatus}`);
      } catch {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
        toast.success(`Simulated: Order status updated to ${newStatus}`);
      }
      fetchData();
    } catch (err) {
      toast.error('Status update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-primary dark:text-emerald-400">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage products, verify shipping queues, and monitor metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-4 bg-primary/10 text-primary dark:bg-emerald-500/10 dark:text-emerald-400 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Total Revenue</h4>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">₹{stats.totalSales}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-4 bg-brown/10 text-brown dark:bg-amber-500/10 dark:text-amber-500 rounded-2xl">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Total Orders</h4>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-4 bg-emerald-550/10 text-emerald-600 dark:bg-emerald-600/10 dark:text-emerald-350 rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Total Products</h4>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 p-6 rounded-3xl flex items-center space-x-4 shadow-sm">
          <div className="p-4 bg-blue-100/30 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Active Buyers</h4>
            <p className="text-2xl font-extrabold text-gray-800 dark:text-white">{stats.totalUsers}</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-beige/30 dark:border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-2 text-sm font-semibold border-b-2 transition duration-150 ${activeTab === 'products' ? 'border-primary text-primary dark:border-emerald-500 dark:text-emerald-400 font-bold' : 'border-transparent text-gray-500 hover:text-primary dark:text-gray-400'}`}
        >
          Products Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-2 text-sm font-semibold border-b-2 transition duration-150 ${activeTab === 'orders' ? 'border-primary text-primary dark:border-emerald-500 dark:text-emerald-400 font-bold' : 'border-transparent text-gray-500 hover:text-primary dark:text-gray-400'}`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-display text-gray-800 dark:text-white">Products Catalog</h2>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-beige-light/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-b border-beige/20 dark:border-gray-800 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Village</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/15 dark:divide-gray-800 text-sm">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-beige/5 dark:hover:bg-gray-800/35 transition border-none">
                      <td className="px-6 py-4">
                        <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800 dark:text-white line-clamp-1 max-w-[200px] mt-2 border-none">
                        {prod.title}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{prod.category}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{prod.village.split(',')[0]}</td>
                      <td className="px-6 py-4 font-bold">₹{prod.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${prod.stock > 5 ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-400'}`}>
                          {prod.stock} left
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 shrink-0">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold font-display text-gray-800 dark:text-white">Customer Orders Queue</h2>

          <div className="bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-beige-light/50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-b border-beige/20 dark:border-gray-800 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Buyer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Items</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/15 dark:divide-gray-800 text-sm">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-beige/5 dark:hover:bg-gray-800/35 transition">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">{ord._id}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs">
                          <p className="font-semibold text-gray-800 dark:text-white">{ord.user?.name || 'Unknown'}</p>
                          <p className="text-gray-500 dark:text-gray-400">{ord.user?.email || ''}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          {ord.products.map((item, idx) => (
                            <p key={idx} className="line-clamp-1 max-w-[150px]">
                              {item.product?.title || 'Product'} x {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold">₹{ord.totalPrice}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ord.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-405' : ord.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-405' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-405'}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className="bg-beige-light dark:bg-gray-800 text-xs font-semibold rounded-lg p-1.5 focus:outline-none border-none text-gray-700 dark:text-gray-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 border border-beige/40 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-beige/40 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-xl font-bold text-primary dark:text-emerald-400 border-b border-beige/20 dark:border-gray-800 pb-3">
              {modalType === 'add' ? 'Add New Product' : 'Edit Product'}
            </h3>
            <form onSubmit={handleProductSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</label>
                <input
                  type="text"
                  placeholder="Product name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <textarea
                  placeholder="Details about raw material, artisan craft process..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-700 dark:text-gray-300"
                  >
                    <option value="Pottery">Pottery</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Woodwork">Woodwork</option>
                    <option value="Organic Food">Organic Food</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Origin Village</label>
                  <input
                    type="text"
                    placeholder="e.g. Saharanpur, UP"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="450"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Stock Qty</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Images (comma-separated URLs)</label>
                <input
                  type="text"
                  placeholder="URL 1, URL 2..."
                  value={images}
                  onChange={(e) => setImages(e.target.value)}
                  className="w-full bg-beige-light dark:bg-gray-800 border-none rounded-xl p-3 text-sm focus:outline-none text-gray-800 dark:text-gray-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition shadow-sm text-sm"
              >
                {modalType === 'add' ? 'Create Product' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
