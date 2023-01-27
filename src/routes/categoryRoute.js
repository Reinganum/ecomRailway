const express=require('express')
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories } = require('../controller/productCategoryController')
const router=express.Router()
const {auth, isAdmin} = require('../middlewares/auth')

router.get('/', getAllCategories)
router.get('/:id',auth,isAdmin,getCategory)
router.post('/', auth, isAdmin, createCategory)
router.put('/:id', auth, isAdmin, updateCategory)
router.delete('/:id', auth, isAdmin, deleteCategory)
module.exports=router