const Category=require('../models/productCategoryModel')
const asyncHandler=require('express-async-handler')
const validateMongoDBID=require('../utils/validateMongoDbID')

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory=await Category.create(req.body)
        res.json(newCategory)
    }catch (error){
        throw new Error(error)
    }
})

const updateCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const updatedCategory=await Category.findByIdAndUpdate(id, req.body,{new:true})
        res.json(updatedCategory)
    }catch (error){
        throw new Error(error)
    }
})

const deleteCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    try{
        const deletedCategory=await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    }catch(error){
        throw new Error(error)
    }
})

const getAllCategories=asyncHandler(async(req,res)=>{
    try{
        const getAllCategories=await Category.find()
        res.json(getAllCategories)
    } catch(error){
        throw new Error(error)
    }
})


const getCategory=asyncHandler(async(req,res)=>{
    const {id}=req.params
    validateMongoDBID(id);
    try{
        const getaCategory=await Category.findById(id)
        res.json(getaCategory)
    } catch(error){
        throw new Error(error)
    }
})

module.exports={
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories,
    
}