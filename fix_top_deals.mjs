import fs from 'fs';
let code = fs.readFileSync('./app/api/top-deals/route.js', 'utf8');
code = code.replace(
  "const categories = ['Fashion', 'Electronics', 'Beauty', 'Health'];",
  "const categories = ['Fashion', 'Electronics', 'Beauty', 'Health', 'Gifts', 'Mobiles', 'Laptops'];"
);
fs.writeFileSync('./app/api/top-deals/route.js', code);
