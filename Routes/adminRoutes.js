const express = require('express')
const adminController = require('../Controllers/adminController')
const adminAuth = require('../Middlewares/adminauth')
const multerConfig = require('../Middlewares/multerMiddleware')

const router = new express.Router()

router.post('/register',adminController.register)
router.post('/login',adminController.login)
router.get('/view-all-users',adminAuth,adminController.viewAllUsers)
router.post('/add-product',adminAuth,multerConfig.single('image'),adminController.addProduct)
router.put('/edit-product/:pid',adminAuth,multerConfig.single('image'),adminController.editproductAPI)
router.delete('/delete-product/:pid',adminAuth,adminController.deleteProductAPI)
router.get('/get-product-byId/:pid',adminAuth,adminController.getProductById)
// category

router.post('/add-category',adminAuth,multerConfig.single('image'),adminController.addCategoryAPI)
router.get('/get-all-categories',adminAuth,adminController.getAllCategoriesAPI)
router.put('/edit-category/:cid',adminAuth,multerConfig.single('image'),adminController.editCategoryAPI)
router.delete('/delete-category/:cid',adminAuth,adminController.deleteCategory)
module.exports = router