import { createClient } from "@prismicio/client";
import sm from "./slicemachine.config.json" assert { type: "json" };

const types = [
  "pinterestgrid",
  "sliceguide1",
  "guide",
  "whatsnew",
  "product",
  "category",
  "affiliate",
  "partner",
  "marketingbanner",
  "page",
  "deal"
];

async function run() {
  const client = createClient(sm.repositoryName);
  
  for (const t of types) {
    try {
      await client.getAllByType(t, { limit: 1 });
      console.log(`Type '${t}' exists.`);
    } catch (e) {
      console.log(`Type '${t}' failed: ${e.message}`);
    }
  }
}
run();
