const express=require('express')
const { createProduct, getAllProducts, getProduct, updateProduct, deleteProductById } = require('../controller/productController')
const router=express.Router()
const {auth,isAdmin}=require('../middlewares/auth')


router.post('/create-product',auth, isAdmin, createProduct)
router.get('/all-products', getAllProducts)
router.get('/get-product/:id',getProduct)
router.put('/:id',auth, isAdmin, updateProduct)
router.delete('/:id',auth,isAdmin, deleteProductById)
module.exports=router