import fs from 'fs';
let code = fs.readFileSync('./components/HomeSidebar.jsx', 'utf8');
code = code.replace(
  "const allCategories = ['Electronics', 'Fashion', 'Kitchen', 'Health', 'Home', 'Games', 'Beauty', 'Pet Supplies', 'Automotive', 'Office'];",
  "const allCategories = ['Electronics', 'Fashion', 'Kitchen', 'Health', 'Home', 'Games', 'Beauty', 'Pet Supplies', 'Automotive', 'Office', 'Gifts', 'Mobiles', 'Laptops'];"
);
fs.writeFileSync('./components/HomeSidebar.jsx', code);
