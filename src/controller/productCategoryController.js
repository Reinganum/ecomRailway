const Category=require('../models/productCategoryModel')
const asyncHandler=require('express-async-handler')
const validateMongoDBID=require('../utils/validateMongoDbID')
const logger = require('../config/logger')

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory=await Category.create(req.body)
        res.json(newCategory)
    }catch (error){
        logger.error(error)
    }
})

const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const updatedCategory=await Category.findByIdAndUpdate(id, req.body,{new:true})
        res.json(updatedCategory)
    }catch (error){
        logger.error(error)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const deletedCategory=await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    }catch(error){
        logger.error(error)
    }
})

const getAllCategories=asyncHandler(async(req,res)=>{
    try{
        const getAllCategories=await Category.find()
        res.json(getAllCategories)
    } catch(error){
        logger.error(error)
    }
})


const getCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDBID(id);
    try{
        const getaCategory=await Category.findById(id)
        res.json(getaCategory)
    } catch(error){
        logger.error(error)
    }
})

module.exports={
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories,
    
}