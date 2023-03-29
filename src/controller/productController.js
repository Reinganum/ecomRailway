const {Product, User}=require('../repository/repository')
const asyncHandler=require('express-async-handler')
const slugify=require('slugify')
const logger = require('../config/index').logger

// CREATE NEW PRODUCT

const createProduct=(asyncHandler(async(req,res)=>{
    if (req.body.title===undefined)return res.sendStatus(400)
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct=await Product.save(req.body)
        res.json(newProduct)
    }catch(error){
        logger.error(`error creating new product: ${error}`)
    }
}))


// GET ALL PRODUCTS

const getAllProducts=asyncHandler(async(req,res)=>{
    if(Object.keys(req.query).length!==0){
        const queryObj={...req.query}
        const overlook=["page","sort","limit","fields"]
        overlook.forEach((el)=>delete queryObj[el])
        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
        const response=await Product.Query(queryStr)
        res.json(response)
    }
    try{
        const product=await Product.getAll()
        res.json(product).status(200)
    } catch (error){
        logger.error(`Error getting or querying products: ${error}`)
    }
})

// QUERY 
/*
// queries with filter
const queryObj={...req.query}
const overlook=["page","sort","limit","fields"]
overlook.forEach((el)=>delete queryObj[el])
let queryStr=JSON.stringify(queryObj)
queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
//let query=Product.find(JSON.parse(queryStr));
// Sorting products
if(req.query.sort){
    const sortBy=req.query.sort.split(',').join(" ")
    console.log(sortBy)
    query=query.sort(sortBy)
} else {
    query=query.sort("-createdAt");
}
// Select query fields
if(req.query.fields){
    const fields=req.query.fields.split(',').join(' ')
    console.log(fields)
    query=query.select(fields)
} else {
    query=query.select("-__v"); //// esconder variables internas ej: -_id
}

// pagination of products
const page=req.query.page
const limit=req.query.limit
const skip=(page -1)*limit
query=query.skip(skip).limit(limit)
if(req.query.page){
    const productCount=await Product.countDocuments();
    // modificar para que lleve a la ultima pagina
    if (skip>=productCount) throw new Error("page not found")
}
// const product=await query; SORTING Y PAGINADO SOLO APLICA A MONGODB VER COMO ADAPTARLO
*/
// GET ONE PRODUCT

const getProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const product=await Product.getById(id)
        if(product.error)return res.status(404).send(product)
        res.json(product).status(200)
    }catch (error){
        logger.error(`Could not get the requested product: ${error}`)
    }
})

// UPDATE PRODUCT 

const updateProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const product=await Product.updateById(id,req.body)
        if(product.error)return res.status(404).send(product)
        res.json(product)
    }catch(error){
        logger.error(`Product could not be updated: ${error}`)
    }
})

// DELETE PRODUCT

const deleteProductById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteProduct=await Product.deleteById(id)
        if(deleteProduct.error) return res.status(404).send(deleteProduct)
        res.json(deleteProduct)
    }catch (error){
        logger.error(`Product could not be deleted: ${error}`)
        res.status(406)
    }
})

// ADD TO WISHLIST FUNCTIONALITY

const addToWishlist=asyncHandler(async (req,res)=>{
    const {_id}=req.user
    const {productId}=req.body
    try{
        const user=await User.getById(_id)
        let wishlist=user.wishlist
        const alreadyAdded=user.wishlist.findIndex((id)=>id===productId)
        console.log(alreadyAdded)
        if(alreadyAdded!==-1){
            console.log("product is already in wishlist")
            wishlist.splice(alreadyAdded,1)
            const response=await User.updateById(_id,{wishlist})
            console.log(response)
            res.json(response.wishlist)
        } else {
            console.log("product was not in wishlist we will push it now")
            wishlist.push(productId)
            const response=await User.updateById(_id,{wishlist})
            res.json(response.wishlist)
        }
    } catch (error){
        logger.error(`Product not updated in user wishlist: ${error}`)
    } 
})

// PRODUCTS RATING 

const rating = asyncHandler(async(req,res)=>{
    const {_id}=req.user
    const {star,prodId}=req.body
    console.log(star,prodId)
    try{
        const product=await Product.getById(prodId)
        const user=await User.getById(_id)
        console.log(product.ratings)
        product.ratings.push({star,ratedBy:user._id})
        const response=await Product.updateById(prodId,{ratings:product.ratings})
        console.log(response)
        res.json(response)
    } catch (error){
        logger.error(`Error scoring product: ${error}`)
    }
    
})

const deleteAllProducts=asyncHandler(async(req,res)=>{
    try{
        const response = await Product.deleteAll()
        res.json(response)
    }catch (error){
        logger.error(`Error scoring product: ${error}`)
    }
})

const getProductByCategory=asyncHandler(async(req,res)=>{
    const {category}=req.params;
    console.log(category)
    try{
        const response = await Product.find({category:category})
        res.json(response)
    }catch (error){
        logger.error(`Error getting product by category: ${error}`)
    }
})

module.exports={
    deleteAllProducts,
    createProduct,
    updateProduct,
    getAllProducts,
    getProduct,
    deleteProductById,
    addToWishlist,
    rating,
    getProductByCategory
}