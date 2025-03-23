const productModel = require("../models/product");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.config");
const { v4: uuidv4 } = require('uuid');

module.exports.getProducts = async (req, res, next) => {
    try {
        
    

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Upload all files asynchronously
        const uploadPromises = req.files.map(async (file) => {
            try {
                // Upload file to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    public_id: `shoes_${uuidv4()}`,
                });

            

                // Optimize delivery
                const optimizeUrl = cloudinary.url(uploadResult.public_id, {
                    fetch_format: 'auto',
                    quality: 'auto'
                });


                // Auto-crop transformation
                const autoCropUrl = cloudinary.url(uploadResult.public_id, {
                    crop: 'auto',
                    gravity: 'auto',
                    width: 500,
                    height: 500,
                });


                // Delete file from local storage
                fs.unlink(file.path, (err) => {
                    if (err) console.error("File deletion error:", err.message);
                    else console.log("File deleted successfully:", file.path);
                });

                return uploadResult.secure_url
            } catch (error) {
                console.error("Upload error:", error);
                return { error: error.message };
            }
        });

        // Wait for all uploads to finish
        const uploadResults = await Promise.all(uploadPromises);
        const validImages = uploadResults.filter((url)=> url != null);
        if(validImages.length === 0){
            return res.status(400).json({ error: "Failed to upload images" });
        }

        const {name , description , price} = req.body

        const newProduct = await productModel.create({
            name,
            description,
            price,
            images: validImages,
            seller: req.user._id,
        })

        res.status(201).json({
            message: "Product created successfully",
            product: newProduct,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


