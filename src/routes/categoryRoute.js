const express=require('express')
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories } = require('../controller/productCategoryController')
const router=express.Router()
const {auth, isAdmin} = require('../middlewares/auth')

router.get('/', getAllCategories)
router.get('/:id',auth, getCategory)
router.post('/', createCategory)
router.put('/:id', auth, updateCategory)
router.delete('/:id', auth, deleteCategory)
module.exports=router