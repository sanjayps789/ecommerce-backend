const express = require('express')
const userController = require('../Controllers/userController')
const userAuth = require('../Middlewares/jwtMiddleware')

const router = new express.Router()

// register
router.post('/register',userController.register)
// login
router.post('/login',userController.login)
// google login
router.post('/google-login',userController.googleLoginAPI)
router.get('/get-all-products',userAuth,userController.getProducts)

// category
router.get('/get-all-categories',userAuth,userController.getAllCategoriesAPI)
router.get('/get-products-byCategory',userAuth,userController.getProductsByCategory)
router.get('/get-product-byId/:pid',userAuth,userController.getProductsById)

// wishlist
router.post('/add-to-wishlist',userAuth,userController.addToWishlist)
router.delete('/remove-from-wishlist/:pid',userAuth,userController.removeItemFromWishlist)
router.get('/get-wishlist-products',userAuth,userController.getWishlistProducts)
// cart
router.post('/add-to-cart',userAuth,userController.addToCartAPI)
router.get('/get-cart-products',userAuth,userController.getCartProducts)
router.delete('/remove-item-from-cart/:pid',userAuth,userController.removeItemFromCart)

router.post('/increment-quantity',userAuth,userController.incrementQuantity)
router.post('/decrement-quantity',userAuth,userController.decrementQuantity)

router.post('/add-delivery-address',userAuth,userController.addDeliveryAddress)



module.exports = router