const express=require('express')
const {auth, isAdmin} = require('../middlewares/auth')
const router=express.Router()
const passport=require('passport')
const {createUser,loginUser, getAllUsers, getUserById, deleteUserById, updateUserById, blockUser, unblockUser, handleRefreshToken,logout, updatePassword, forgotPasswordToken, resetPassword, getWishList, userCart, getUserCart, emptyCart}=require('../controller/userController')
router.post('/register',createUser)
router.post('/login',loginUser)
router.post('/passport',passport.authenticate('local', {failureRedirect:'/'}),loginUser);
router.post('/recover-password', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.get('/all',getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/wishlist',auth, getWishList)
router.get('/:id',auth, isAdmin, getUserById)
router.delete('/:id',deleteUserById)
router.put('/password',auth, updatePassword)
router.put('/:id',auth,updateUserById)
router.put('/block/:id',auth, isAdmin, blockUser)
router.put('/unblock/:id',auth, isAdmin, unblockUser)
module.exports=router


