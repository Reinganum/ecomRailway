const {Category}=require('../repository/repository')
const asyncHandler=require('express-async-handler')
const validateMongoDBID=require('../utils/validateMongoDbID')
const {logger}=require('../config/index')

const createCategory=asyncHandler(async(req,res)=>{
    try{
        const newCategory=await Category.save(req.body)
        console.log(newCategory)
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
        const getAllCategories=await Category.getAll()
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