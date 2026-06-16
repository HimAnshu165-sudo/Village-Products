const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Load env variables
dotenv.config({ path: './.env' });

const products = [
  {
    title: 'Handcrafted Terracotta Clay Water Jug',
    description: 'Traditionally baked earthenware water jug made from pure clay. Naturally cools water, enhances taste, and adds a rustic charm to your dining table. Crafted by third-generation potters in Rajasthan.',
    category: 'Pottery',
    images: ['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
    price: 450,
    stock: 25,
    village: 'Pokhran, Rajasthan',
    rating: 4.8,
  },
  {
    title: 'Jaipur Blue Pottery Floral Vase',
    description: 'An exquisite hand-painted blue pottery flower vase using quartz clay. Features intricate traditional Persian-floral motifs. A perfect statement piece for modern home decor.',
    category: 'Pottery',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
    price: 1250,
    stock: 12,
    village: 'Sanganer, Rajasthan',
    rating: 4.9,
  },
  {
    title: 'Handwoven Khadi Cotton Saree',
    description: 'Elegantly spun handloom cotton saree dyed in natural indigo vegetable colors. Soft, breathable, and supports sustainable village weavers in West Bengal.',
    category: 'Textiles',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    price: 2400,
    stock: 8,
    village: 'Phulia, West Bengal',
    rating: 4.7,
  },
  {
    title: 'Hand-Block Printed Cotton Cushion Covers (Set of 2)',
    description: 'Soft organic cotton cushion covers featuring heritage Ajrakh geometric hand-block printing. Indigo and madder red natural dyes make it skin-friendly and rich in aesthetic details.',
    category: 'Textiles',
    images: ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'],
    price: 650,
    stock: 30,
    village: 'Dhamadka, Gujarat',
    rating: 4.6,
  },
  {
    title: 'Handcarved Sheesham Wood Elephant',
    description: 'Beautifully detailed elephant figurine handcarved from premium seasoned rosewood (Sheesham) with brass inlay work. Symbolizes wisdom and luck.',
    category: 'Woodwork',
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
    price: 890,
    stock: 15,
    village: 'Saharanpur, Uttar Pradesh',
    rating: 4.9,
  },
  {
    title: 'Handcarved Wooden Kitchen Coasters (Set of 6)',
    description: 'Rustic wooden drink coasters with a carved geometric mandala pattern. Comes with a matching holder. Protects tables and acts as a beautiful table-top accessory.',
    category: 'Woodwork',
    images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80'],
    price: 380,
    stock: 40,
    village: 'Channapatna, Karnataka',
    rating: 4.5,
  },
  {
    title: 'Pure Organic Lakadong Turmeric Powder (250g)',
    description: 'High-curcumin (7-9%) organic turmeric cultivated in the hills of Meghalaya. Known for its intense aroma, bright golden color, and superior medicinal properties.',
    category: 'Organic Food',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80'],
    price: 290,
    stock: 50,
    village: 'Jaintia Hills, Meghalaya',
    rating: 4.9,
  },
  {
    title: 'Raw Wild Forest Honey (500g)',
    description: '100% natural, unfiltered wild honey ethically harvested from the Sundarbans forest reserves. Rich in antioxidants and enzymes, with a unique woody flavor profile.',
    category: 'Organic Food',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    price: 480,
    stock: 35,
    village: 'Sundarbans, West Bengal',
    rating: 4.8,
  },
  {
    title: 'Woven Bamboo Cane Utility Storage Basket',
    description: 'Strong, eco-friendly bamboo storage basket hand-braided by rural artisans. Versatile usage as a fruit basket, laundry basket, or stylish plant-pot holder.',
    category: 'Woodwork',
    images: ['https://images.unsplash.com/photo-1531835551805-16d864c8d311?auto=format&fit=crop&w=800&q=80'],
    price: 720,
    stock: 18,
    village: 'Agartala, Tripura',
    rating: 4.7,
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing database
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('Database cleared.');

    // Seed default users
    const adminUser = await User.create({
      name: 'GramSetu Admin',
      email: 'admin@gramsetu.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Delhi Customer',
      email: 'delhi.buyer@gmail.com',
      password: 'buyerpassword123',
      role: 'customer',
    });

    console.log('Default users seeded successfully:');
    console.log('Admin User: admin@gramsetu.com / adminpassword123');
    console.log('Customer User: delhi.buyer@gmail.com / buyerpassword123');

    // Seed default products
    await Product.insertMany(products);
    console.log('Default products seeded successfully.');

    mongoose.connection.close();
    console.log('Seeding completed and connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
