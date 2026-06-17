import { createClient } from "./prismicio.js";

async function checkRepo() {
  const client = createClient();
  try {
    const repo = await client.getRepository();
    console.log("Types in repo:", repo.types);
  } catch (err) {
    console.error("Error fetching repo info:", err);
  }
}

checkRepo();
