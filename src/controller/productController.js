const Product=require('../models/productModel')
const asyncHandler=require('express-async-handler')
const slugify=require('slugify')
const User=require('../models/userModel')
const logger = require('../config/logger')
const Repo=require('../repository/repository')
const Users = Repo.Usr
const Messages=Repo.Msgs
const Items=Repo.Prods

// CREATE NEW PRODUCT

const createProduct=(asyncHandler(async(req,res)=>{
    if (req.body.title===undefined)return res.sendStatus(400)
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct=await Items.save(req.body)
        res.json(newProduct)
    }catch(error){
        logger.error(`error creating new product: ${error}`)
    }
}))


// GET ALL PRODUCTS OR QUERY 

const getAllProducts=asyncHandler(async(req,res)=>{
    try{
        // queries with filter
        const queryObj={...req.query}
        const overlook=["page","sort","limit","fields"]
        overlook.forEach((el)=>delete queryObj[el])
        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
        let query=Product.find(JSON.parse(queryStr));
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
        const product=await Items.getAll()
        res.json(product).status(200)
    } catch (error){
        logger.error(`Error getting or querying products: ${error}`)
    }
})


// GET ONE PRODUCT

const getProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const product=await Items.getById(id)
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
        const product=await Items.updateById(id,req.body)
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
        const deleteProduct=await Items.deleteById(id)
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
    const {prodId}=req.body
    try{
        const user=await User.findById(_id)
        const alreadyAdded=user.Wishlist.find((id)=>id.toString()===prodId)
        if(alreadyAdded){
            let user=await User.findByIdAndUpdate(_id,
                {
                    $pull:{Wishlist:prodId}
                },
                {
                    new:true,
                }
            )
            res.json(user)
        } else {
            let user=await User.findByIdAndUpdate(_id,
                {
                    $push:{Wishlist:prodId}
                },
                {
                    new:true,
                }
            )
            res.json(user)
        }
    } catch (error){
        logger.error(`Product not updated in user wishlist: ${error}`)
    } 
})

// PRODUCTS RATING 

const rating = asyncHandler(async(req,res)=>{
    const {_id}=req.user
    const {star,prodId}=req.body
    try{
        
        const product=await Product.findById(prodId)
        let alreadyRated=product.ratings.find((userId)=>userId.postedBy.toString()===_id.toString())
        if (alreadyRated){
            const updateRating=await Product.updateOne({
                ratings:{$elemMatch:alreadyRated},
            }, 
            {
                $set:{"ratings.$.star":star}
            },
            {
                new:true
            })
        }else{
            const rateProduct=await Product.findByIdAndUpdate(prodId, {
                $push:{
                    ratings:
                    {
                        "star":star,
                        postedBy:_id
                    }
                }
            },{new:true})
        }
        let foundProduct=await Product.findById(prodId)
        let amountOfRatings=foundProduct.ratings.length
        let ratingSum=foundProduct.ratings
        .map((rating)=>rating.star)
        .reduce((a,b)=>a+b,0)
        let actualRating=ratingSum/amountOfRatings
        let updatedProduct=await Product.findByIdAndUpdate(prodId, {totalRating:actualRating},{new:true})
        res.json(updatedProduct)
    } catch (error){
        logger.error(`Error scoring product: ${error}`)
    }
    
})

const deleteAllProducts=asyncHandler(async(req,res)=>{
    try{
        const response = await Items.deleteAll()
        res.json(response)
    }catch (error){
        logger.error(`Error scoring product: ${error}`)
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
    rating
}