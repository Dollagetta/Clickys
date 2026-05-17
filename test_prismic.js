const { createClient } = require('@prismicio/client');

async function test() {
  const client = createClient('myclickys'); // Try connecting without access token if it's public
  
  try {
    const pages = await client.getAllByType("whatsnew");
    console.log("Found", pages.length, "whatsnew pages.");
    for (const page of pages) {
      console.log("--------------- PAGE UID:", page.uid);
      console.log(JSON.stringify(page.data, null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}

test();
