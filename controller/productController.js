const Product=require('../models/productModel')
const asyncHandler=require('express-async-handler')
const slugify=require('slugify')

// CREATE NEW PRODUCT

const createProduct=(asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const newProduct=await Product.create(req.body)
        res.json(newProduct)
    }catch(error){
        throw new Error(`error getting products: ${error}`)
    }
}))


// GET ALL PRODUCTS OR QUERY 

const getAllProducts=asyncHandler(async(req,res)=>{
    try{
        const queryObj={...req.query}
        const overlook=["page","sort","limit","fields"]
        overlook.forEach((el)=>delete queryObj[el])
        let queryStr=JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
        const query=Product.find(JSON.parse(queryStr));
        const getProducts=await query
        res.json(getProducts)
    } catch (error){
        throw new Error(error)
    }
})

// GET ONE PRODUCT

const getProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const product=await Product.findById(id)
        res.json(product)
    }catch (error){
        throw new Error(error)
    }
})

// UPDATE PRODUCT 

const updateProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const product=await Product.findByIdAndUpdate(id,req.body,{new:true})
        console.log(product)
        res.json(product)
    }catch(error){
        throw new Error(error)
    }
})

// DELETE PRODUCT

const deleteProductById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
        const deleteProduct=await Product.findByIdAndDelete(id)
        res.json(deleteProduct)
    }catch (error){
        throw new Error(error)
    }
})

module.exports={
    createProduct,
    updateProduct,
    getAllProducts,
    getProduct,
    deleteProductById,
}