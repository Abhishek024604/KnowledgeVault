const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

// Create a dummy PDF
const pdfBytes = Buffer.from(
  'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
  'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
  'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
  'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
  'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSCgkJPj4KICA+Pgog' +
  'IC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9udAog' +
  'IC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1' +
  'IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcw' +
  'IDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9i' +
  'agoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAw' +
  'MDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDE2NyAwMDAwMCBuIAowMDAwMDAwMjg3IDAwMDAw' +
  'IG4gCjAwMDAwMDAzNzYgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9vdCAx' +
  'IDAgUgo+PgpzdGFydHhyZWYKNDcyCiUlRU9GCg==', 'base64');

fs.writeFileSync('dummy.pdf', pdfBytes);

async function testUpload() {
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    console.log("Uploading dummy.pdf to Cloudinary...");
    const dataURI = "data:application/pdf;base64," + pdfBytes.toString('base64');
    
    // Test with raw and auto
    const resRaw = await cloudinary.uploader.upload(dataURI, { resource_type: 'raw' });
    console.log("RAW URL:", resRaw.secure_url);
    
    // Now try to fetch the URL to see if it's blocked
    const fetchRes = await axios.get(resRaw.secure_url);
    console.log("Fetch Status:", fetchRes.status, fetchRes.headers['content-type']);
  } catch (err) {
    console.error("Upload error:", err.message);
  }
}

testUpload();
