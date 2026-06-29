const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const pdfBytes = fs.readFileSync('dummy.pdf');

async function testUpload() {
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    console.log("Uploading dummy.pdf to Cloudinary with 'auto'...");
    const dataURI = "data:application/pdf;base64," + pdfBytes.toString('base64');
    
    const resAuto = await cloudinary.uploader.upload(dataURI, { resource_type: 'auto' });
    console.log("AUTO URL:", resAuto.secure_url);
    
    const fetchRes = await axios.get(resAuto.secure_url, { validateStatus: () => true });
    console.log("Fetch Status:", fetchRes.status, fetchRes.headers['content-type']);
  } catch (err) {
    console.error("Upload error:", err.message);
  }
}

testUpload();
