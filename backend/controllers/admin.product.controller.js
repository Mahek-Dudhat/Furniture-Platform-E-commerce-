const Product = require('../models/products.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');
const cloudinary = require('../config/cloudinary.js');

//Get all Products:
const getAllProducts = asyncHandler(
    async (req, res) => {
        const { page = 1, limit = 6, search, category, brand, color, material } = req.query;

        let query = {};

        //Safe pagination limit:
        const MAX_LIMIT = 12;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(MAX_LIMIT, Number(limit) || 12);

        // Escape regex special characters (security + performance)
        const escapeRegex = (text) => text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        if (search) {
            const safeSearch = escapeRegex(search.trim());

            // IF text index exists → use $text (FAST)
            query.$text = { $search: safeSearch };
        }

        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (color) query.color = color;
        if (material) query.material = material;

        const products = await Product.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / Number(limitNum));

        console.log('total:', total);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: Number(pageNum),
            totalPages,
            data: products
        });

        console.log('total pages:', Math.floor(total / limit));
    }
)

//Create product:
const createProduct = asyncHandler(
    async (req, res) => {

        const { name, description, price, discount, category, stock, color, material, brand, warranty } = req.body;

        // Handle image uploads (assuming images are uploaded via multer/cloudinary)
        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'furniture-products'
                });

                images.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

        }

        const product = await Product.create({
            name,
            description,
            price,
            discount: discount || 0,
            images,
            category,
            stock,
            inStock: stock > 0,
            color,
            material,
            brand: brand || 'Aura Vista',
            warranty
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });

    }
)

//Update product:
const updateProduct = asyncHandler(
    async (req, res) => {
        const product = await Product.findByIdAndUpdate(req.params.id);

        if (!product) {
            throw new CustomErrorHandler(404, 'Product not found');
        }


        // Handle new image uploads
        if (req.file && req.files.length > 0) {
            //Delete old images from cloudinary
            for (const image of product.images) {
                await cloudinary.uploader.destroy(image.public_id);
            }

            //Upload new images to cloudinary
            let imagesArray = [];

            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'furniture-products'
                });

                imagesArray.push({
                    public_id: result.public_id,
                    url: result.secure_url
                });
            }

            req.body.images = imagesArray;
        }

        //Update stock status
        if (req.body.stock !== undefined) {
            req.body.inStock = req.body.stock > 0;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });


        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });

    }
)

const deleteProduct = asyncHandler(
    async (req, res) => {
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new CustomErrorHandler(404, 'Product not found');
        }

        for (const image of product.images) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
)

//Update stock in bulk:
const bulkUpdateStock = asyncHandler(
    async (req, res) => {
        const { updates } = req.body;

        const results = [];
        for (const update of updates) {
            const product = await Product.findByIdAndUpdate(update.productId, { stock: update.stock, inStock: update.stock > 0 }, { new: true, runValidators: true });
            results.push(product);
        }


        res.status(200).json({
            success: true,
            message: 'Stock updated successfully',
            data: results
        });
    }
)

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateStock,
}