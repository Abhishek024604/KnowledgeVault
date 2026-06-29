const axios = require('axios');

async function testMicrolink() {
  const url = 'https://www.msn.com/en-in/news/india/13-year-old-creates-history-becomes-first-female-heir-to-rajasthan-royal-family/ar-AA26DgCf?ocid=msedgntp&pc=W198&cvid=6a41d85ef6e94fa69ba9d7ab577a3a25&ei=19';
  try {
    const res = await axios.get(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
    console.log("SUCCESS:", JSON.stringify(res.data.data, null, 2));
  } catch (err) {
    console.log("FAIL:", err.message);
  }
}
testMicrolink();
