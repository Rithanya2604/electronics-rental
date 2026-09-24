require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const productRows = [
  [1, 'Gaming Laptop', 'laptop.png', 'Intel i7 • RTX 4060 Graphics', 699, 3000, 'Laptops'],
  [2, 'MacBook Air M3', 'macbook.png', 'Apple M3 • 16GB RAM', 999, 5000, 'Laptops'],
  [3, 'iPhone 16', 'phones.png', '256GB • 5G', 799, 3500, 'Mobiles'],
  [4, 'Samsung Galaxy S25', 'samsung.png', '12GB RAM • 256GB', 699, 3000, 'Mobiles'],
  [5, 'DSLR Camera', 'camera.png', 'Professional Photography', 499, 2000, 'Cameras'],
  [6, 'Sony Mirrorless Camera', 'sonycamera.png', '4K • Interchangeable Lens', 799, 3500, 'Cameras'],
  [7, 'Noise Cancelling Headphones', 'headphone.png', 'Premium Wireless Audio', 199, 1000, 'Accessories'],
  [8, 'Wireless Earbuds', 'earbuds.png', 'Bluetooth • ANC', 149, 800, 'Accessories'],
  [9, 'PlayStation 5', 'game.png', 'Next-gen Gaming Console', 899, 4000, 'Gaming'],
  [10, 'Meta Quest 3', 'vr.png', 'Virtual Reality Headset', 599, 3000, 'Gaming'],
  [11, 'JBL Flip 6', 'speaker.png', 'Portable Bluetooth Speaker', 149, 700, 'Speakers'],
  [12, 'iPad Air', 'tablet.png', '10.9-inch Retina Display', 449, 2000, 'Tablets'],
  [13, 'Apple Watch Series 10', 'watch.png', 'Fitness & Health Tracking', 249, 1200, 'Wearables'],
  [14, 'Smart Projector', 'projector.png', 'Full HD Home Theatre', 399, 1800, 'Projectors'],
  [15, 'DJI Mini Drone', 'drone.png', '4K Camera Drone', 999, 5000, 'Drones'],
  [16, 'Gaming Monitor', 'monitor.png', '27-inch 165Hz IPS Display', 1049, 4500, 'Monitors'],
  [17, 'Wireless Printer', 'printer.png', 'All-in-One Ink Tank', 299, 1400, 'Printers']
];

const products = productRows.map(([legacyId, name, image, desc, price, deposit, category]) => ({
  legacyId,
  name,
  image,
  desc,
  price,
  deposit,
  category,
  stock: 5
}));

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  const email = 'admin@gadgets4u.com';
  const exists = await User.findOne({ email });
  if (!exists) {
    const password = await bcrypt.hash('Admin@123', 12);
    await User.create({ name:'Gadgets4U Admin', email, phone:'9999999999', password, role:'admin' });
  }
  console.log('Products seeded. Admin: admin@gadgets4u.com / Admin@123');
  await mongoose.disconnect();
}
seed().catch(err => { console.error(err); process.exit(1); });
