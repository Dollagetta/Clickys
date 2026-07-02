import fs from 'fs';
let code = fs.readFileSync('./app/page.jsx', 'utf8');
if (!code.includes('FiSmartphone')) {
  code = code.replace(
    "import { FiZap, FiShoppingCart, FiTrendingUp, FiGift, FiShield, FiThumbsUp, FiArrowRight, FiMessageSquare, FiAward, FiCheckCircle, FiClock } from 'react-icons/fi';",
    "import { FiZap, FiShoppingCart, FiTrendingUp, FiGift, FiShield, FiThumbsUp, FiArrowRight, FiMessageSquare, FiAward, FiCheckCircle, FiClock, FiSmartphone } from 'react-icons/fi';"
  );
  fs.writeFileSync('./app/page.jsx', code);
}
