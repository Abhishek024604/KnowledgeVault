const axios = require('axios');

async function testMicrolink(url) {
  try {
    const res = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    console.log(`URL: ${url}`);
    console.log(`Title:`, res.data.data.title);
    console.log(`Image:`, res.data.data.image?.url || 'NONE');
    console.log('---------------------------');
  } catch (err) {
    console.error(`Error for ${url}:`, err.message);
  }
}

async function run() {
  await testMicrolink('youtu.be/dQw4w9WgXcQ?si=abcdef12345');
}

run();
