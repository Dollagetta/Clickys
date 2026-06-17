import { createClient } from "./prismicio.js";

async function checkPages() {
  const client = createClient();
  try {
    const pages = await client.getAllByType("page");
    console.log("Pages found:", pages.length);
    pages.forEach(p => console.log(`- UID: ${p.uid}, ID: ${p.id}`));
  } catch (err) {
    console.error("Error fetching pages:", err);
  }
}

checkPages();
