import { fetchProductsFromSheet } from './lib/products';

async function test() {
  console.log("Fetching products from sheet...");
  try {
    const products = await fetchProductsFromSheet();
    console.log("Successfully fetched products!", products.length, "items found.");
    if (products.length > 0) {
      console.log("Sample product:", products[0]);
    }
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
