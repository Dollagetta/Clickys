import fs from 'fs';
let code = fs.readFileSync('./app/page.jsx', 'utf8');

const oldCats = `const placeholderCategories = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', icon: 'FiMonitor', color: '#3b82f6' },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', icon: 'FiShoppingBag', color: '#ec4899' },
  { id: 'cat3', name: 'Kitchen', slug: 'kitchen', icon: 'FiCoffee', color: '#f59e0b' },
  { id: 'cat4', name: 'Health', slug: 'health', icon: 'FiActivity', color: '#10b981' },
  { id: 'cat5', name: 'Home', slug: 'home', icon: 'FiHome', color: '#8b5cf6' },
  { id: 'cat6', name: 'Games', slug: 'games', icon: 'FiPlayCircle', color: '#ef4444' },
  { id: 'cat7', name: 'Beauty', slug: 'beauty', icon: 'FiStar', color: '#f43f5e' },
  { id: 'cat8', name: 'Pet Supplies', slug: 'pet-supplies', icon: 'FiHeart', color: '#06b6d4' },
  { id: 'cat9', name: 'Automotive', slug: 'automotive', icon: 'FiTruck', color: '#f97316' },
  { id: 'cat10', name: 'Office', slug: 'office', icon: 'FiPaperclip', color: '#6366f1' },
];`;

const newCats = `const placeholderCategories = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', icon: 'FiMonitor', color: '#3b82f6' },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', icon: 'FiShoppingBag', color: '#ec4899' },
  { id: 'cat3', name: 'Kitchen', slug: 'kitchen', icon: 'FiCoffee', color: '#f59e0b' },
  { id: 'cat4', name: 'Health', slug: 'health', icon: 'FiActivity', color: '#10b981' },
  { id: 'cat5', name: 'Home', slug: 'home', icon: 'FiHome', color: '#8b5cf6' },
  { id: 'cat6', name: 'Games', slug: 'games', icon: 'FiPlayCircle', color: '#ef4444' },
  { id: 'cat7', name: 'Beauty', slug: 'beauty', icon: 'FiStar', color: '#f43f5e' },
  { id: 'cat8', name: 'Pet Supplies', slug: 'pet-supplies', icon: 'FiHeart', color: '#06b6d4' },
  { id: 'cat9', name: 'Automotive', slug: 'automotive', icon: 'FiTruck', color: '#f97316' },
  { id: 'cat10', name: 'Office', slug: 'office', icon: 'FiPaperclip', color: '#6366f1' },
  { id: 'cat11', name: 'Gifts', slug: 'gifts', icon: 'FiGift', color: '#ec4899' },
  { id: 'cat12', name: 'Mobiles', slug: 'mobiles', icon: 'FiSmartphone', color: '#3b82f6' },
  { id: 'cat13', name: 'Laptops', slug: 'laptops', icon: 'FiMonitor', color: '#6366f1' },
];`;

code = code.replace(oldCats, newCats);
fs.writeFileSync('./app/page.jsx', code);
