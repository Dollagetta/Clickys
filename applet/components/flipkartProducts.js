const products = [
  {
    name: 'Affordable Asus vivobook 15 intel corei5',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/m/9/o/-original-imahcd9csvsgaypy.jpeg?q=70',
    amazonLink: 'https://fktr.in/pNu3EY4',
    rating: 4.8,
    reviewCount: 4658
  },
  {
    name: 'inbase buds mini pro noise cancelling earpods',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/e/v/f/-original-imahbzmfcrpac9xr.jpeg?q=70',
    amazonLink: 'https://fktr.in/tAcuqcG',
    rating: 4.7,
    reviewCount: 2893
  },
  {
    name: 'Best Soldering Station',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/kolsscw0/soldering-iron/q/9/a/900-3-in-1-premium-quality-smd-rework-station-hot-air-gun-with-original-imag3y8ugzhcjgqx.jpeg?q=70',
    amazonLink: 'https://fktr.in/nmdJ6If',
    rating: 4.5,
    reviewCount: 2423
  },
  {
    name: 'Chubs wheel for workouts',
    category: 'Health',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/ab-exerciser/h/s/l/ab-roller-wheel-sturdy-ab-workout-equipment-for-core-workout-ab-original-imahcwzf3xzjzppw.jpeg?q=70',
    amazonLink: 'https://fktr.in/O8hWcVx',
    rating: 4.6,
    reviewCount: 3357
  },
  {
    name: 'Yoga Mats',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/flipkart1%202-1718968435.png',
    amazonLink: 'https://fktr.in/JEIRC9S',
    rating: 4.6,
    reviewCount: 1634
  },
  {
    name: 'Tooth Brush Holders',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/29-1706509523.jpg',
    amazonLink: 'https://fktr.in/4IFWpFq',
    rating: 4.7,
    reviewCount: 2049
  },
  {
    name: 'Stainless steel cookware',
    category: 'Kitchen',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/kc3p30w0/pressure-cooker/f/z/4/20674-prestige-original-imaftahz9h4jzphp.jpeg?q=70',
    amazonLink: 'https://fktr.in/gRTUmuT',
    rating: 4.6,
    reviewCount: 5775
  },
  {
    name: 'cheap Cookware set',
    category: 'Kitchen',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/21-1716295766.jpg',
    amazonLink: 'https://fktr.in/fIQu0GK',
    rating: 4.7,
    reviewCount: 2459
  },
  {
    name: 'Top white sling bags',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shopsy-sling-bag/4/3/w/az-cg001-1-az-cg001-regular-size-sling-bag-alonzo-original-imahygsjhn2fgmma.jpeg?q=70',
    amazonLink: 'https://fktr.in/AkbD9pf',
    rating: 4.6,
    reviewCount: 757
  },
  {
    name: 'Lightweight Best Quality Formal Shoes for men',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/l/0/o/-original-imagsfdwsyba3msn.jpeg?q=70',
    amazonLink: 'https://fktr.in/WwOaOvc',
    rating: 4.7,
    reviewCount: 4897
  },
  {
    name: 'Best Quality laptop Bags',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/bags/laptop-backpack/n/j/q/laptop-bag-sleeve-for-15-6-16-inch-laptop-case-cover-pro-with-original-imahc8g2xv5aanhs.jpeg?q=70',
    amazonLink: 'https://fktr.in/o87BaTd',
    rating: 4.7,
    reviewCount: 8634
  },
  {
    name: 'Universal wireless mouses',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/mouse/i/4/j/blanc-zebronics-original-imahcjzs38arc9kh.jpeg?q=70',
    amazonLink: 'https://fktr.in/ERzRgOL',
    rating: 4.5,
    reviewCount: 3657
  },
  {
    name: 'Portronics Toad Ergo Vertical Advanced 2.4 GHz',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/mouse/3/s/w/toad-ergo-vertical-advanced-ergonomic-6-button-supports-wrist-original-imah8bgyqa84a6gg.jpeg?q=70',
    amazonLink: 'https://fktr.in/Vxh79RA',
    rating: 4.6,
    reviewCount: 2657
  },
  {
    name: 'Nothing best noise cancelling earpods',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/y/o/3/-original-imahyfkkgm6mtgb2.jpeg?q=70',
    amazonLink: 'https://fktr.in/p8joud6',
    rating: 4.7,
    reviewCount: 4657
  },
  {
    name: 'Top Rosemary-enriched Coconut Hair oil under less Rs200',
    category: 'Health',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/hair-oil/d/5/5/-original-imagtqwxrb6adp6z.jpeg?q=70',
    amazonLink: 'https://fktr.in/XzMNO42',
    rating: 4.4,
    reviewCount: 2982
  },
  {
    name: 'Gym Essentials',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/13-1726220014.jpg',
    amazonLink: 'https://fktr.in/uQ8w9Ar',
    rating: 4.5,
    reviewCount: 1582
  },
  {
    name: 'Quality home workout equipments',
    category: 'Health',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/kit/l/i/l/way-to-fitness-toning-tube-and-hand-grip-combo-kit-way-to-original-imagvbr5fpzesyhh.jpeg?q=70',
    amazonLink: 'https://fktr.in/dF9DONe',
    rating: 4.5,
    reviewCount: 875
  },
  {
    name: 'Best induction cooker stoves under Rs2000',
    category: 'Kitchen',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/induction-cook-top/9/e/c/atlas-neo-atlas-neo-prestige-original-imah8yyfm2qtpyyp.jpeg?q=70',
    amazonLink: 'https://fktr.in/Dx0kFxv',
    rating: 4.6,
    reviewCount: 657
  },
  {
    name: 'Budget foldable study table less Rs1200',
    category: 'Kitchen',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/office-study-table/j/i/e/41-mdf-solid-wood-teak-62-limraz-furniture-69-brown-original-imagxqb2tceshjhz.jpeg?q=70',
    amazonLink: 'https://fktr.in/EAQ6OsF',
    rating: 4.6,
    reviewCount: 2765
  },
  {
    name: 'Men Striped Round Neck Cotton Blend Maroon T-Shirt',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/r/9/n/s-t1-cross-stich-original-imaggn9eqjsyc5er.jpeg?q=70',
    amazonLink: 'https://fktr.in/sgjgTgw',
    rating: 4.5,
    reviewCount: 544
  },
  {
    name: 'Quality cheap sneakers for men',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/9/h/p/6-snk-eva-870-wht-6-bruton-white-original-imahbgva488ashad.jpeg?q=70',
    amazonLink: 'https://fktr.in/lIzd9t2',
    rating: 4.6,
    reviewCount: 677
  },
  {
    name: 'Leather Land Brown, Gold Women Sling Bag',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sling-bag/8/u/g/-original-imagvjznv9fgerb9.jpeg?q=70',
    amazonLink: 'https://fktr.in/9cbqroj',
    rating: 4.6,
    reviewCount: 653
  },
  {
    name: 'Zebronics wireless Headphones',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/c/f/b/-original-imahdfe7umzhtbku.jpeg?q=70',
    amazonLink: 'https://fktr.in/m5b7V4I',
    rating: 4.7,
    reviewCount: 444
  },
  {
    name: 'Best cheap hair trimmers',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/trimmer/4/a/u/0-5-12-mm-ng-1153-digital-usb-stainless-steel-corded-cordless-original-imahdz3kkkzufwyk.jpeg?q=70',
    amazonLink: 'https://fktr.in/08Vrubi',
    rating: 4.6,
    reviewCount: 587
  },
  {
    name: 'Wall tri fold mirror',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/mirror/3/m/r/framed-rectangle-1-folding-cosmetic-shaving-mirror-360-degree-original-imahfb7pfkqvvn7f.jpeg?q=70',
    amazonLink: 'https://fktr.in/619pi9j',
    rating: 4.7,
    reviewCount: 1657
  },
  {
    name: 'Under eye repair cream',
    category: 'Health',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/eye-cream/m/t/h/15-snail-peptide-96-under-eye-repair-cream-with-snail-mucin-original-imah4m5yhgptsdx7.jpeg?q=70',
    amazonLink: 'https://fktr.in/zIq6Z41',
    rating: 4.6,
    reviewCount: 1657
  },
  {
    name: 'Loreal absolute skin repair cream',
    category: 'Health',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/combo-kit/f/c/r/-original-imah95zhnwh4dj4n.jpeg?q=70',
    amazonLink: 'https://fktr.in/9SXk5ws',
    rating: 4.6,
    reviewCount: 757
  },
  {
    name: 'Best face wash',
    category: 'Health',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/face-wash/c/d/a/300-ocean-for-men-anti-acne-pimple-skin-brightening-all-skin-original-imah5gh6hayymkfv.jpeg?q=70',
    amazonLink: 'https://fktr.in/hdR4RbF',
    rating: 4.6,
    reviewCount: 1275
  },
  {
    name: 'Home deals',
    category: 'Kitchen',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/image%20(5)-1750056118.png',
    amazonLink: 'https://fktr.in/Af3lcK6',
    rating: 4.5,
    reviewCount: 1587
  },
  {
    name: 'Electronic Kettles',
    category: 'Kitchen',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Dealflipkart1-1685084782.png',
    amazonLink: 'https://fktr.in/49I0h16',
    rating: 4.7,
    reviewCount: 2612
  },
  {
    name: 'Top Kitchen and Dining Range',
    category: 'Kitchen',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/17-1689576413.jpg',
    amazonLink: 'https://fktr.in/r9zQCrv',
    rating: 4.7,
    reviewCount: 2519
  },
  {
    name: 'Women Regular High Rise Black Jeans',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/jean/t/s/f/34-kttladiesjeans848-kotty-original-imahdtdmhkmpnehr.jpeg?q=70',
    amazonLink: 'https://fktr.in/hdno9dq',
    rating: 4.7,
    reviewCount: 1342
  },
  {
    name: 'Women Flared High Rise Blue Jeans',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/200/200/cms-rpd-images/6cc9b9344d664c1ab8cbd8b02b5766a4_186e341cc5b_JEAGFKYGFBRAJHG9_1.jpg.jpeg?q=90',
    amazonLink: 'https://fktr.in/vKtBvzx',
    rating: 4.7,
    reviewCount: 1342
  },
  {
    name: 'Men Self Design Zip Neck Polyester Maroon T-Shirt',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/v/3/c/xl-zipperpolo-sti-original-imahcyd9vzdg9wdq.jpeg?q=70',
    amazonLink: 'https://fktr.in/Bzj141U',
    rating: 4.7,
    reviewCount: 546
  },
  {
    name: 'Realme 14 Pro',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/x/t/6/-original-imah8ffzb6tjbzaf.jpeg?q=70',
    amazonLink: 'https://fktr.in/fa8vOG2',
    rating: 4.6,
    reviewCount: 33
  },
  {
    name: 'IQOO Neo 10R 5G (MoonKnight Titanium, 128 GB)',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/y/q/z/10r-5g-i2221-iqoo-original-imaha7hgqdhpgqvv.jpeg?q=70',
    amazonLink: 'https://fktr.in/IJCJbcd',
    rating: 4.6,
    reviewCount: 485
  },
  {
    name: 'Zebronics Best Wireless Headphones',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/wireless-headset/j/h/o/zeb-zebronics-original-imahbhtctaskv9tf.jpeg?q=70',
    amazonLink: 'https://fktr.in/XY8B76M',
    rating: 4.6,
    reviewCount: 1567
  },
  {
    name: 'Baby Gift Pack',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Himalaya%20Happy%20Baby%20Gift%20Pack-1752490755.png',
    amazonLink: 'https://fktr.in/1e4EjFV',
    rating: 4.4,
    reviewCount: 1465
  },
  {
    name: 'Makeup Kit',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Flipkart-Makeup%20Kits%20Combo_-1739439367.png',
    amazonLink: 'https://fktr.in/rbstArs',
    rating: 4.5,
    reviewCount: 1653
  },
  {
    name: 'Pure Detox Skin Care',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/23-1687518638.jpg',
    amazonLink: 'https://fktr.in/6Ojjxv6',
    rating: 4.5,
    reviewCount: 1618
  },
  {
    name: 'Cheap Juicer mixer',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/06-1717670668.jpg',
    amazonLink: 'https://fktr.in/x18Z8DB',
    rating: 4.5,
    reviewCount: 1678
  },
  {
    name: 'Mesh Sneakers',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/6/v/q/-original-imahd2zac3zan3kb.jpeg?q=70',
    amazonLink: 'https://fktr.in/bPyd2cG',
    rating: 4.7,
    reviewCount: 443
  },
  {
    name: 'Layasa Quality sneakers',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/3/d/y/8-ld2601-42-layasa-blue-original-imahd3za6x4h2ekz.jpeg?q=70',
    amazonLink: 'https://fktr.in/8bMAbWU',
    rating: 4.5,
    reviewCount: 1377
  },
  {
    name: 'Ankle Boot Sneakers',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/z/x/p/-original-imahcfhftrkcf8zj.jpeg?q=70',
    amazonLink: 'https://fktr.in/jog3qr0',
    rating: 4.7,
    reviewCount: 559
  },
  {
    name: 'Compatible Laptop Battery',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/laptop-battery/laptop-battery/k/5/n/ht03xl-laptop-battery-compatible-with-pavilion-14-hp-original-imahcsh2mgmm88m7.jpeg?q=70',
    amazonLink: 'https://fktr.in/bI1RIxl',
    rating: 4.6,
    reviewCount: 1884
  },
  {
    name: 'Lenovo Best Laptop Batteries',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/832/832/laptop-battery/b/f/z/lenovo-lenovo-57y6266-battery-original-imae2pz2r7pdzjfh.jpeg?q=70',
    amazonLink: 'https://fktr.in/m5b7V4I',
    rating: 4.6,
    reviewCount: 226
  },
  {
    name: 'Samsung Galaxy S25 Ultra 5G at Rs79499',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/y/e/8/-original-imahyvntxfrpuw6g.jpeg?q=70',
    amazonLink: 'https://fktr.in/XqTqiKQ',
    rating: 4.8,
    reviewCount: 453
  },
  {
    name: 'Daily Essentials T-Shirts',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/23-1687503295.jpg',
    amazonLink: 'https://fktr.in/TzFcbv1',
    rating: 4.6,
    reviewCount: 1935
  },
  {
    name: 'Best Funky Sliders',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/26-1719379812.jpg',
    amazonLink: 'https://fktr.in/icBarqv',
    rating: 4.5,
    reviewCount: 1639
  },
  {
    name: 'Best womens flip flops',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/18-1710740073.jpg',
    amazonLink: 'https://fktr.in/5MhG02g',
    rating: 4.5,
    reviewCount: 1695
  },
  {
    name: 'On Trolley Bags',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Dealflipkart10-1746079389.png',
    amazonLink: 'https://fktr.in/Ea7d1Vh',
    rating: 4.5,
    reviewCount: 1542
  },
  {
    name: 'HP intel corei5 12th Gen under Rs46000',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/d/n/8/-original-imahcd9mayb7ybmg.jpeg?q=70',
    amazonLink: 'https://fktr.in/HTERC2s',
    rating: 4.6,
    reviewCount: 2458
  },
  {
    name: 'Nothing 3a the best mobiles',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/e/l/m/-original-imahcfcfhxrf5hzg.jpeg?q=70',
    amazonLink: 'https://fktr.in/4L1bjiV',
    rating: 4.6,
    reviewCount: 2347
  },
  {
    name: 'Cheap HP Pavilion battery',
    category: 'Electronics',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/laptop-battery/laptop-battery/k/5/n/ht03xl-laptop-battery-compatible-with-pavilion-14-hp-original-imahcsh2mgmm88m7.jpeg?q=70',
    amazonLink: 'https://fktr.in/2uAGu3M',
    rating: 4.6,
    reviewCount: 742
  },
  {
    name: 'Skin Repairing Shampoo',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/image%20(3)-1752491380.png',
    amazonLink: 'https://fktr.in/8Unr18e',
    rating: 4.7,
    reviewCount: 2087
  },
  {
    name: 'De-Tan best Face wash',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Flipkart-Facewashes-1752227476.png',
    amazonLink: 'https://fktr.in/2ubR2vt',
    rating: 4.5,
    reviewCount: 1842
  },
  {
    name: 'Baby Diaper',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Cuddles%20-%20Baby%20Diaper-1752490645.png',
    amazonLink: 'https://fktr.in/ziXJ667',
    rating: 4.5,
    reviewCount: 1621
  },
  {
    name: 'Quality cheap Men vest',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Rupa%20Men%20Vest-1752490881.png',
    amazonLink: 'https://fktr.in/GSngP9J',
    rating: 4.5,
    reviewCount: 1512
  },
  {
    name: 'Top Vacy Print Dresses',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Deal4%2030-1747724536.png',
    amazonLink: 'https://fktr.in/sJbqsu4',
    rating: 4.6,
    reviewCount: 1698
  },
  {
    name: 'Quality Casual shoes',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Deal4%2019-1737022651.png',
    amazonLink: 'https://fktr.in/JkD1uQS',
    rating: 4.7,
    reviewCount: 2498
  },
  {
    name: 'Best Personal care',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/22-1729577240.jpg',
    amazonLink: 'https://fktr.in/EAVbW5M',
    rating: 4.7,
    reviewCount: 2349
  },
  {
    name: 'Top Beauty and grooming',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/26-1698302010.jpg',
    amazonLink: 'https://fktr.in/zgmTFmM',
    rating: 4.5,
    reviewCount: 1823
  },
  {
    name: 'Mobile Accessories',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/MicrosoftTeams-image%20(58)-1692257870.png',
    amazonLink: 'https://fktr.in/lgbXbvZ',
    rating: 4.5,
    reviewCount: 1748
  },
  {
    name: 'Quality Hair Straighteners',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/MicrosoftTeams-image%20(14)-1698816164.png',
    amazonLink: 'https://fktr.in/00xTlzj',
    rating: 4.6,
    reviewCount: 1764
  },
  {
    name: 'Best Portable Fan',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/10-1715326993.jpg',
    amazonLink: 'https://fktr.in/4gRoi7f',
    rating: 4.6,
    reviewCount: 1731
  },
  {
    name: 'Cheap umbrellas',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/umbrella/k/6/g/11-1-pcs-blue-auto-open-close-button-3-fold-umbrellas-for-rain-original-imagzphv8gsvpz5q.jpeg?q=70',
    amazonLink: 'https://fktr.in/7wi99Gx',
    rating: 4.6,
    reviewCount: 1597
  },
  {
    name: 'Best Sunglasses',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/image-1744624250.png',
    amazonLink: 'https://fktr.in/g4zpsMw',
    rating: 4.7,
    reviewCount: 2068
  },
  {
    name: 'Water bottles',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/20-1695201316.jpg',
    amazonLink: 'https://fktr.in/HrP26ws',
    rating: 4.7,
    reviewCount: 2314
  },
  {
    name: 'Top Sports shoes',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/08-1720418116.jpg',
    amazonLink: 'https://fktr.in/aJ7Fez8',
    rating: 4.5,
    reviewCount: 1945
  },
  {
    name: 'Saldan lotion',
    category: 'Health',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Deal20%2010-1746185605.png',
    amazonLink: 'https://fktr.in/KxsYJb7',
    rating: 4.7,
    reviewCount: 1987
  },
  {
    name: 'Smart Tizen TV',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Samsung%20HD%20Ready%20LED%20Smart%20Tizen%20TV-1752491152.png',
    amazonLink: 'https://fktr.in/owcyP3f',
    rating: 4.7,
    reviewCount: 2756
  },
  {
    name: 'Top Soundbars',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/19-1726732442.jpg',
    amazonLink: 'https://fktr.in/8DSxXra',
    rating: 4.6,
    reviewCount: 1729
  },
  {
    name: 'Best Summer caps',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/05-1717569597.jpg',
    amazonLink: 'https://fktr.in/J4bGupz',
    rating: 4.5,
    reviewCount: 1432
  },
  {
    name: 'Tape Shoes',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/17-1721200555.jpg',
    amazonLink: 'https://fktr.in/dQBavE4',
    rating: 4.5,
    reviewCount: 1689
  },
  {
    name: 'Women T-shirts',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/deal4%2025-1742280915.png',
    amazonLink: 'https://fktr.in/07Qtixn',
    rating: 4.5,
    reviewCount: 1923
  },
  {
    name: 'Quality Hair dryers',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/1-20-03-23-Flipkart-TSP-1679373330.jpg',
    amazonLink: 'https://fktr.in/ou8wg6c',
    rating: 4.5,
    reviewCount: 1789
  },
  {
    name: 'Top cheap trimmers',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/trimmers1-1743747007.png',
    amazonLink: 'https://fktr.in/jsf8c5N',
    rating: 4.7,
    reviewCount: 2134
  },
  {
    name: 'Top cheap watches',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/23-1687503295.jpg',
    amazonLink: 'https://fktr.in/TzFcbv1',
    rating: 4.7,
    reviewCount: 2025
  },
  {
    name: 'Best cargos',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/flipkartdeal1%201-1745921035.png',
    amazonLink: 'https://fktr.in/8py4gT5',
    rating: 4.5,
    reviewCount: 1456
  },
  {
    name: 'Top Formal shirts',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Flipkart-Formal%20Shirts-1739959369.png',
    amazonLink: 'https://fktr.in/zkSFg8z',
    rating: 4.5,
    reviewCount: 1892
  },
  {
    name: 'Quality Packing Bags',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/deal1%2041-1746079295.png',
    amazonLink: 'https://fktr.in/ICtgSFQ',
    rating: 4.7,
    reviewCount: 2012
  },
  {
    name: 'Best women tops',
    category: 'Fashion',
    imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/top/j/h/7/m-3-half-sleeve-women-top-tops-for-women-cotton-rib-tops-for-original-imahcghhzzfawfxu.jpeg?q=70',
    amazonLink: 'https://fktr.in/rh0tgAe',
    rating: 4.7,
    reviewCount: 2678
  },
  {
    name: 'Best earpods',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/deal20%206-1740996554.png',
    amazonLink: 'https://fktr.in/HgLU1eB',
    rating: 4.7,
    reviewCount: 2198
  },
  {
    name: 'Top smartwatches',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Deal%2011%20(1)-1718358241.png',
    amazonLink: 'https://fktr.in/m9i9cPb',
    rating: 4.5,
    reviewCount: 1569
  },
  {
    name: 'Quality Sneakers',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Deal23%208-1738929022.png',
    amazonLink: 'https://fktr.in/1pF1aBV',
    rating: 4.7,
    reviewCount: 2345
  },
  {
    name: 'Top Denim Jackets',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Deal-2%208-1738316861.png',
    amazonLink: 'https://fktr.in/pp7k6du',
    rating: 4.8,
    reviewCount: 2789
  },
  {
    name: 'Quality footwear',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Myntra%209-1733736501.jpg',
    amazonLink: 'https://fktr.in/7x27Pfw',
    rating: 4.8,
    reviewCount: 2985
  },
  {
    name: 'Cheap Irons',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/04%2013-1736158498.jpg',
    amazonLink: 'https://fktr.in/3KUFFly',
    rating: 4.7,
    reviewCount: 1876
  },
  {
    name: 'Fast Mobile charger',
    category: 'Electronics',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/Flipkart-Mobile%20Chargers-1747394993.png',
    amazonLink: 'https://fktr.in/ofCUt5w',
    rating: 4.7,
    reviewCount: 2456
  },
  {
    name: 'Best Belts',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/fk%202-1733822851.jpg',
    amazonLink: 'https://fktr.in/oLSc5oh',
    rating: 4.7,
    reviewCount: 1567
  },
  {
    name: 'Boat smart watches',
    category: 'Fashion',
    imageUrl: 'https://asset22.ckassets.com/resources/image/staticpage_images/04%2013-1736158498.jpg',
    amazonLink: 'https://fktr.in/3wdNQPh',
    rating: 4.5,
    reviewCount: 1423
  }
];

export { products };
