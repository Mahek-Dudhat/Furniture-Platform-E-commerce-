require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/products.model.js');
const cloudinary = require('../config/cloudinary.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler.js');


const productsData = [
    {
        "productId": "FRN001",
        "name": "Modern Velvet Sofa",
        "price": 74617,
        "category": "Sofa",
        "description": "Luxurious velvet sofa with deep seating and elegant design",
        "image": [
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
            "https://plus.unsplash.com/premium_photo-1739612417248-b155b42142b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TW9kZXJuJTIwVmVsdmV0JTIwU29mYXxlbnwwfHwwfHx8MA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1760003841702-4e020083267d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8TW9kZXJuJTIwVmVsdmV0JTIwU29mYXxlbnwwfHwwfHx8MA%3D%3D",
            "https://images.unsplash.com/photo-1759722665629-29df6ee4f9a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fE1vZGVybiUyMFZlbHZldCUyMFNvZmF8ZW58MHx8MHx8fDA%3D"
        ],
        "inStock": true,
        "quantity": 15,
        "color": "Navy Blue",
        "material": "Velvet",
        "brand": "Aura Vista",
        "rating": 4.8,
        "discount": 15,
        "warranty": "2 years"
    },
    {
        "productId": "FRN002",
        "name": "Scandinavian Dining Table",
        "price": 53867,
        "category": "Table",
        "description": "Minimalist oak dining table perfect for modern homes",
        "image": [
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
            "https://plus.unsplash.com/premium_photo-1670359037518-95e2d90acb06?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8U2NhbmRpbmF2aWFuJTIwRGluaW5nJTIwVGFibGV8ZW58MHx8MHx8fDA%3D",
            "https://plus.unsplash.com/premium_photo-1683141419137-db47132b8df4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFNjYW5kaW5hdmlhbiUyMERpbmluZyUyMFRhYmxlfGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1739918559783-ed40311fc814?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFNjYW5kaW5hdmlhbiUyMERpbmluZyUyMFRhYmxlfGVufDB8fDB8fHww",
        ],
        "inStock": true,
        "quantity": 8,
        "color": "Natural Oak",
        "material": "Solid Oak Wood",
        "brand": "Aura Vista",
        "rating": 4.9,
        "discount": 10,
        "warranty": "5 years"
    },
    {
        "productId": "FRN003",
        "name": "Leather Accent Chair",
        "price": 37267,
        "category": "Chair",
        "description": "Premium leather accent chair with ergonomic design",
        "image": [
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 20,
        "color": "Cognac Brown",
        "material": "Genuine Leather",
        "brand": "Aura Vista",
        "rating": 4.7,
        "discount": 20,
        "warranty": "3 years"
    },
    {
        "productId": "FRN004",
        "name": "Mid-Century Coffee Table",
        "price": 27307,
        "category": "Table",
        "description": "Stylish coffee table with walnut finish and tapered legs",
        "image": [
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80",
            "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1565191999001-551c187427bb?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 12,
        "color": "Walnut",
        "material": "Walnut Wood",
        "brand": "Aura Vista",
        "rating": 4.6,
        "discount": 5,
        "warranty": "2 years"
    },
    {
        "productId": "FRN005",
        "name": "Upholstered King Bed",
        "price": 107817,
        "category": "Bed",
        "description": "Elegant upholstered bed with tufted headboard",
        "image": [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
            "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 6,
        "color": "Light Gray",
        "material": "Linen Fabric",
        "brand": "Aura Vista",
        "rating": 4.9,
        "discount": 12,
        "warranty": "5 years"
    },
    {
        "productId": "FRN006",
        "name": "Minimalist Bookshelf",
        "price": 33117,
        "category": "Storage",
        "description": "Open bookshelf with clean lines and ample storage",
        "image": [
            "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80",
            "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 18,
        "color": "White Oak",
        "material": "Oak Wood",
        "brand": "Aura Vista",
        "rating": 4.5,
        "discount": 8,
        "warranty": "3 years"
    },
    {
        "productId": "FRN007",
        "name": "Recliner Lounge Chair",
        "price": 66317,
        "category": "Chair",
        "description": "Comfortable recliner with adjustable positions",
        "image": [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
            "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1519961655-2e34a667aef9?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 10,
        "color": "Charcoal Gray",
        "material": "Fabric",
        "brand": "Aura Vista",
        "rating": 4.8,
        "discount": 18,
        "warranty": "2 years"
    },
    {
        "productId": "FRN008",
        "name": "Industrial TV Stand",
        "price": 45567,
        "category": "Storage",
        "description": "Rustic TV stand with metal frame and wood shelves",
        "image": [
            "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZnVybml0dXJlJTIwc3RvcmFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
            "https://images.unsplash.com/photo-1565191999001-551c187427bb?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 14,
        "color": "Rustic Brown",
        "material": "Wood & Metal",
        "brand": "Aura Vista",
        "rating": 4.7,
        "discount": 10,
        "warranty": "3 years"
    },
    {
        "productId": "FRN009",
        "name": "Tufted Ottoman",
        "price": 20667,
        "category": "Ottoman",
        "description": "Versatile ottoman with storage and tufted top",
        "image": [
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 25,
        "color": "Beige",
        "material": "Linen",
        "brand": "Aura Vista",
        "rating": 4.6,
        "discount": 15,
        "warranty": "1 year"
    },
    {
        "productId": "FRN010",
        "name": "L-Shaped Sectional",
        "price": 132717,
        "category": "Sofa",
        "description": "Spacious sectional sofa perfect for family gatherings",
        "image": [
            "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 5,
        "color": "Slate Gray",
        "material": "Microfiber",
        "brand": "Aura Vista",
        "rating": 4.9,
        "discount": 20,
        "warranty": "5 years"
    },
    {
        "productId": "FRN011",
        "name": "Wooden Nightstand",
        "price": 16517,
        "category": "Storage",
        "description": "Compact nightstand with drawer and open shelf",
        "image": [
            "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80",
            "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 30,
        "color": "Espresso",
        "material": "Pine Wood",
        "brand": "Aura Vista",
        "rating": 4.5,
        "discount": 5,
        "warranty": "2 years"
    },
    {
        "productId": "FRN012",
        "name": "Ergonomic Office Chair",
        "price": 31457,
        "category": "Chair",
        "description": "Adjustable office chair with lumbar support",
        "image": [
            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80",
            "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=60",
            "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&auto=format&fit=crop&q=60"
        ],
        "inStock": true,
        "quantity": 22,
        "color": "Black",
        "material": "Mesh & Leather",
        "brand": "Aura Vista",
        "rating": 4.7,
        "discount": 12,
        "warranty": "3 years"
    }
]

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
}

//function to upload image to cloudinary:
const uploadImageToCloudinary = async (imageUrl, productId, index) => {
    try {
        console.log(`    [${index + 1}] Uploading image...`);

        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "furniture-products", //Folder in cloudinary
            public_id: `${productId}_img${index + 1}_${Date.now()}`, // Unique name
            transformation: [
                {
                    width: 1200,
                    height: 1200,
                    crop: 'limit', // Don't crop, just limit size
                    quality: 'auto:good', // Automatic quality optimization
                    fetch_format: 'auto' // Auto-convert to WebP/AVIF
                }
            ]
        });

        console.log("Result:", result);
        console.log(`✓ Image ${index + 1} uploaded successfully`);

        // Generate URL with WebP/AVIF conversion
        const optimizedUrl = cloudinary.url(result.public_id, {
            fetch_format: 'auto',
            quality: 'auto:good',
            secure: true
        });

        return {
            public_id: result.public_id,
            url: optimizedUrl
        }
    } catch (err) {
        console.log(err);
        throw new CustomErrorHandler(500, 'Failed to upload image in cloudinary..');
    }
}

// Function to upload all images to Cloudinary
const uploadAllImages = async (imageUrl, productId) => {
    const uploadImages = [];

    for (let i = 0; i < imageUrl.length; i++) {
        try {
            const uploadImage = await uploadImageToCloudinary(imageUrl[i], productId, i);
            uploadImages.push(uploadImage);
        } catch (err) {
            console.log(err);
            console.error(`  ✗ Failed to upload image ${i + 1}, skipping...`);
            // Continue with other images even if one fails
        }
    }

    return uploadImages;

}

const initData = async () => {
    try {
        await connectDB().then(console.log("connection established..")).catch((err) => {
            console.log("connection failed..");
            console.log(err);
        });

        console.log('🗑️  Clearing existing products...');
        await Product.deleteMany({});

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < productsData.length; i++) {
            const productData = productsData[i];

            console.log(`\n[${i + 1}/${productsData.length}] Processing: ${productData.name}`);
            console.log(`  Product ID: ${productData.productId}`);

            try {
                const uploadImages = await uploadAllImages(productData.image, productData.productId)

                if (uploadImages.length === 0) {
                    console.log(`  ✗ No images uploaded for ${productData.name}, skipping product`);
                    failCount++;
                    continue;
                }

                console.log('Uploaded images: ', uploadImages);

                // Create product in database
                const product = await Product.create({
                    ...productData,
                    rating: {
                        average: productData.rating,
                        count: 0
                    },
                    images: uploadImages
                });

                console.log(`  ✓ Product created in database`);
                console.log('product:', product);
                successCount++;


            } catch (err) {
                console.error(`  ✗ Error processing product:`, err.message);
                failCount++;
                process.exit(1);
            }
        }

        console.log(`📊 Total images uploaded: ~${successCount * 4} images`);
        process.exit(0);

    } catch (err) {
        console.log(err);
    }
}

initData();
