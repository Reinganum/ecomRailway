const express=require('express')
const {auth, isAdmin} = require('../middlewares/auth')
const router=express.Router()
const {createUser,loginUser, getAllUsers, getUserById, deleteUserById, updateUserById, blockUser, unblockUser, handleRefreshToken,logout}=require('../controller/userController')
router.post('/register',createUser)
router.post('/login',loginUser)
router.get('/all-users',getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/:id',auth, isAdmin, getUserById)
router.delete('/:id',deleteUserById)
router.put('/:id',auth,updateUserById)
router.put('/block/:id',auth, isAdmin, blockUser)
router.put('/unblock/:id',auth, isAdmin, unblockUser)
module.exports=router