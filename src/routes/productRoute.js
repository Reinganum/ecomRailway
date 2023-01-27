const express=require('express')
const { createProduct, getAllProducts, getProduct, updateProduct, addToWishlist, deleteProductById, rating} = require('../controller/productController')
const router=express.Router()
const {auth,isAdmin}=require('../middlewares/auth')

router.post('/', auth, isAdmin, createProduct)
router.get('/:id', getProduct)
router.put('/wishlist',auth, addToWishlist)
router.put('/rating',auth,rating)
router.put('/:id', auth, isAdmin, updateProduct)
router.delete('/:id', auth, isAdmin, deleteProductById)
router.get('/', getAllProducts)

module.exports=router