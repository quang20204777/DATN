const express = require('express');
const router = express.Router();
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const sharp = require('sharp');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
          
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/uploadimage', upload.single('quangimage'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.json({ success: false, message: 'No image file provided' });
    }

    sharp(file.buffer)
        .resize({ width: 800 })
        .toBuffer(async (err, data, info) => {
            if (err) {
                console.error('Image processing error:', err);
                return res.json({ success: false, message: 'Error processing image' });
            }

            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return res.json({ success: false, message: 'Error uploading image to Cloudinary' });
                }

                res.json({ success: true, data: result.url, message: 'Image uploaded successfully' });
            }).end(data);
         })
});
module.exports = router;