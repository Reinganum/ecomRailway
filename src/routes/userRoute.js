const express=require('express')
const {auth, isAdmin} = require('../middlewares/auth')
const router=express.Router()
const passport=require('passport')
const {createUser,loginUser, getAllUsers, getUserById, deleteUserById, updateUserById, blockUser, unblockUser, handleRefreshToken,logoutUser, updatePassword, forgotPasswordToken, resetPassword, getWishList,getAuthedUser}=require('../controller/userController')
const { userValidation } = require('../utils/validateJoi')


router.post('/register', userValidation, createUser)
router.post('/login', loginUser)
router.post('/recover-password', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logoutUser)
router.get('/wishlist',auth, getWishList)
router.get('/all',getAllUsers)
router.get('/:id',auth, getUserById) 
router.delete('/:id',auth,deleteUserById)
router.put('/password',auth, updatePassword)
router.put('/:id',auth, updateUserById)
router.put('/block/:id',auth, isAdmin, blockUser)
router.put('/unblock/:id',auth, unblockUser)
router.get('/',auth,getAuthedUser)

module.exports=router


