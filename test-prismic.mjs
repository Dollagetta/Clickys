import { createClient } from "@prismicio/client";

const client = createClient("myclickys", { fetch });

async function main() {
  const result = await client.dangerouslyGetAll();
  console.log(JSON.stringify(result.map(r => ({ type: r.type, data: Object.keys(r.data) })), null, 2));
}

main().catch(console.error);