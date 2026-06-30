import { createClient } from "@prismicio/client";
import sm from "./slicemachine.config.json" with { type: "json" };
async function run() {
  const client = createClient(sm.repositoryName);
  try {
    const docs = await client.getAllByType('sliceguide1', { limit: 1 });
    console.log("sliceguide1:", Object.keys(docs[0]?.data || {}));
  } catch (e) {
    console.log("sliceguide1 failed:", e.message);
  }
  try {
    const docs2 = await client.getAllByType('guide', { limit: 1 });
    console.log("guide:", Object.keys(docs2[0]?.data || {}));
    console.log("guide length:", docs2.length);
  } catch (e) {}
}
run();
