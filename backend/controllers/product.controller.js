const Product = require('../models/products.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');

// Utility function: Escape regex special characters to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getAllProducts = asyncHandler(async (req, res) => {
    try {

        if (!req.query) {
            const products = await Product.find({});

            if (products) {
                res.status(200).json(products);
            } else {
                throw new CustomErrorHandler(404, 'No products found');
            }

        }

        const { search, category, color, material, brand, minPrice, maxPrice, inStock, sort, order, page = 1, limit = 6 } = req.query;

        let query = {};


        // 1️⃣ TEXT SEARCH (using MongoDB text index)
        if (search) {
            const escaped = escapeRegex(search.trim());

            // IF text index exists → use $text (FAST)
            query.$text = { $search: escaped };
        }

        // 1. SEARCH (by name or descri ption)
        // if (search) {
        //     query.$or = [
        //         { name: { $regex: search, $options: 'i' } },
        //         { description: { $regex: search, $options: 'i' } }
        //     ]
        // }

        // 2. CATEGORY FILTER

        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (brand) {
            const brands = Array.isArray(brand) ? brand : [brand];
            query.brand = { $in: brands }
        }

        // 4. COLOR FILTER (can be multiple)
        if (color) {
            const colors = Array.isArray(color) ? color : [color];
            query.color = { $in: colors };
        }

        // 5. MATERIAL FILTER (can be multiple)
        if (material) {
            const materials = Array.isArray(material) ? material : [material];
            query.material = { $in: materials };
        }

        // 6. PRICE RANGE FILTER
        if (minPrice || maxPrice) {
            query.price = {};

            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // 7. STOCK AVAILABILITY
        if (inStock !== undefined) {
            query.inStock = inStock === 'true';
        }

        // BUILD SORT OBJECT
        let sortOptions = {};

        if (sort) {
            const sortOrder = order === 'desc' ? -1 : 1;

            switch (sort) {
                case 'price':
                    sortOptions.price = sortOrder;
                    break;

                case 'name':
                    sortOptions.name = sortOrder;
                    break;

                case 'rating':
                    sortOptions['rating.average'] = sortOrder;
                    break;

                case 'createdAt':
                    sortOptions.createdAt = sortOrder;
                    break;
                case 'discount':
                    sortOptions.discount = sortOrder;
                    break;
                default:
                    sortOptions.createdAt = -1; // Default: newest first
            }
        } else {
            sortOptions.createdAt = -1;
        }

        // PAGINATION

        //Safe pagination limit:
        const MAX_LIMIT = 12;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(MAX_LIMIT, Number(limit) || 12);
        const skip = (Number(pageNum) - 1) * Number(limitNum);

        // EXECUTE QUERY
        const products = await Product.find(query).sort(sortOptions).skip(skip).limit(Number(limit)).lean();
        // .lean() for better performance;

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / Number(limitNum));

        //Send the response to the frontend:
        res.status(200).json({
            success: true,
            count: products.length,
            total: totalProducts,
            page: Number(pageNum),
            totalPages,
            hasMore: Number(pageNum) < totalPages,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new CustomErrorHandler(500, 'Error fetching products..');
    }

});

const getProductById = asyncHandler(
    async (req, res) => {
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new CustomErrorHandler(404, 'Product not found');
        }

        // Increment view count
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    }
)

// @desc    Get unique filter options (for filter sidebar)
const getFilterOptions = asyncHandler(
    async (req, res) => {
        const { category } = req.query;

        let query = {};

        if (category && category !== 'all') {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        // Get unique values for filters
        const [brands, colors, materials, categories] = await Promise.all(
            [
                Product.distinct('brand', query),
                Product.distinct('color', query),
                Product.distinct('material', query),
                Product.distinct('category', query)
            ]
        )

        // Get price range
        const priceRange = await Product.aggregate(
            [
                { $match: query },
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                }
            ]
        )

        res.status(200).json({
            success: true,
            data: {
                brands: brands.sort(),
                colors: colors.sort(),
                materials: materials.sort(),
                categories: categories.sort(),
                priceRange: priceRange[0] || { minPrice: 0, maxPrice: 150000 }
            }
        });
    }

)

module.exports = {
    getAllProducts,
    getProductById,
    getFilterOptions,
};

