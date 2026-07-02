import fs from 'fs';
let code = fs.readFileSync('./app/page.jsx', 'utf8');

const oldLogic = `    let categories = [...placeholderCategories];
    if (categoriesResResult.status === 'fulfilled' && categoriesResResult.value.length > 0) {
      categories = categoriesResResult.value.map(doc => ({
        id: doc.id,
        slug: doc.uid || doc.data.title?.toLowerCase().replace(/\\s+/g, '-'),
        name: doc.data.title || 'Category',
        imageField: doc.data.image,
        icon: doc.data.icon || 'FiStar',
        color: doc.data.color || '#3dd370'
      }));
    }`;
    
const newLogic = `    let categories = [...placeholderCategories];
    if (categoriesResResult.status === 'fulfilled' && categoriesResResult.value.length > 0) {
      const prismicCats = categoriesResResult.value.map(doc => ({
        id: doc.id,
        slug: doc.uid || doc.data.title?.toLowerCase().replace(/\\s+/g, '-'),
        name: doc.data.title || 'Category',
        imageField: doc.data.image,
        icon: doc.data.icon || 'FiStar',
        color: doc.data.color || '#3dd370'
      }));
      const prismicNames = new Set(prismicCats.map(c => c.name.toLowerCase()));
      categories = [...prismicCats, ...categories.filter(c => !prismicNames.has(c.name.toLowerCase()))];
    }`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('./app/page.jsx', code);
