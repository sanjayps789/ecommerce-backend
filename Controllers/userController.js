const users = require('../Models/userModel.js')
const categoryModel = require('../Models/categoryModel.js')
const products = require('../Models/productModel.js')
const wishlists = require('../Models/wishlistModel.js')
const cartModel = require('../Models/cartModel.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const orders = require('../Models/order.js')
// register
exports.register = async (req, res) => {
    console.log("Inside register API");
    try {
        const { username, email, password } = req.body
        console.log(username, email, password);
        const hashPassword = bcrypt.hashSync(password, 10)
        const existingUser = await users.findOne({ email })
        console.log(existingUser);
        if (existingUser) {
            return res.status(404).json("Account already exists...Please login!!!")
        } else {
            const newUser = new users({
                username, email, password: hashPassword
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

//  Login
exports.login = async (req, res) => {
    console.log("Inside Login API!!!");
    const { email, password } = req.body

    try {
        const existingUser = await users.findOne({ email })
        if (!existingUser) {
            return res.status(404).json("Account does not exist...Please register!!!")
        }
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(404).json("Invalid Password...Please try again!!!")
        }
        //  if both valid create token
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY)
        res.status(200).json({ token, existingUser })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}



// Google signup login
exports.googleLoginAPI = async (req, res) => {
    console.log("Inside Google Login API!!!");
    const { username, email } = req.body;
    console.log(username, email);
    try {
        const existingUser = await users.findOne({ email });
        console.log(existingUser);
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY)
            res.status(200).json({ token, existingUser })
        } else {
            // create new password randomly
            let newPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(newPassword, 10)
            const newUser = new users({ username, email, password: hashedPassword })
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY)
            await newUser.save()
            res.status(200).json({ token, newUser })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error", message: err.message });
    }
}

// get all products
exports.getProducts = async (req, res) => {
    console.log("Inside Get All Products API!!!")
    try {
        const allProducts = await products.find()
        if (allProducts) {
            res.status(200).json(allProducts)
        } else {
            res.status(401).json("Products Not Found")
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}



// get all categories
exports.getAllCategoriesAPI = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        if (categories) {
            res.status(200).json(categories)
        } else {
            res.status(401).json("Categories Not Found")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message })

    }
}


// get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.query;
        let query = {};
        if (categoryName) {
            query.category = categoryName;
        }
        // Find the products with the query
        const getProducts = await products.find(query);
        if (getProducts.length === 0) {
            res.status(404).json("Products Not Found!!!");
        } else {
            return res.status(200).json(getProducts);
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};


exports.getProductsById = async (req, res) => {
    console.log("Inside get products By Id API!!!");
    try {
        const { pid } = req.params
        const product = await products.findOne({ _id: pid })
        if (product) {
            res.status(200).json(product)
        } else {
            return res.status(404).json("Product not Found!!!")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });

    }
}


// add to wishlist
exports.addToWishlist = async (req, res) => {
    console.log("Inside Add To Wishlist API!!!");
    try {
        const { productId } = req.body
        const userId = req.user
        console.log(userId);

        // const product = await products.findOne({_id:pid})
        // check if product already exists in the wishlist
        const existingWishlistItem = await wishlists.findOne({ userId, productId })
        if (existingWishlistItem) {
            return res.status(404).json("Product Already exits in your wishlist!!!")
        } else {
            const newWishlistItem = new wishlists({
                userId, productId
            })
            await newWishlistItem.save()
            res.status(200).json({ message: "Product added in your wishlist!!!", product: newWishlistItem })
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
}

// remove Item from wishlist
exports.removeItemFromWishlist = async (req, res) => {
    const { pid } = req.params
    const userId = req.user
    try {
        const product = await wishlists.findOne({ userId, _id: pid })
        if (product) {
            const removedItem = await wishlists.findByIdAndDelete({ _id: pid })
            return res.status(200).json({ message: "Product Removed From Your Wishlist", removedItem })
        } else {
            return res.status(404).json("Product Not Found!!!")
        }

    } catch (error) {
        return res.status(500).Inte
    }
}

// get all products in wishlist
exports.getWishlistProducts = async (req, res) => {
    try {
        console.log("Inside Get Wishlist Products API");
        const allProducts = await wishlists.find({ userId: req.user }).populate('productId')
        if (allProducts) {
            res.status(200).json(allProducts)
        } else {
            return res.status(404).json("Products not Found!!!")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal  Server Error", message: error.message })
    }
}


// add to cart
exports.addToCartAPI = async (req, res) => {
    console.log("Inside Add To Cart API");
    try {
        const { productId } = req.body
        const userId = req.user
        console.log(userId);
        const product = await products.findOne({ _id: productId })
        const existingProduct = await cartModel.findOne({ userId, productId })

        if (!existingProduct) {
            const newProduct = new cartModel({
                userId, productId, quantity: 1, originalPrice: product.price
            })
            await newProduct.save()
            return res.status(200).json({ message: "Product added in your cart!!!", product: newProduct })
        } else {
            // update quantity and original price in cart
            const updatedQuantity = existingProduct.quantity += 1
            const updatedOriginalPrice = parseFloat(updatedQuantity) * parseFloat(product.price)

            const updatedProduct = await cartModel.findByIdAndUpdate(existingProduct._id, { quantity: updatedQuantity, originalPrice: updatedOriginalPrice }, { new: true })

            return res.status(200).json({ message: "Product added in your cart!!!", product: updatedProduct })
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}



// get all products in cart
exports.getCartProducts = async (req, res) => {
    const userId = req.user
    try {
        // console.log("Inside Get Cart Products API");
        const allProducts = await cartModel.find({userId}).populate('productId')
        if (allProducts) {
            // find total price of cart
            return res.status(200).json(allProducts)
        } else {
            // set total price to 0 if cart is empty
            return res.status(404).json("Products not Found!!!")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal  Server Error", message: error.message })
    }
}

// remove item from cart
exports.removeItemFromCart = async (req, res) => {
    console.log("Inside Remove Item From Cart API");
    try {
        const { pid } = req.params
        const userId = req.user
        const product = await cartModel.findOne({ userId, _id: pid })
        if (product) {
            const removedItem = await cartModel.findByIdAndDelete({ _id: pid })
            return res.status(200).json({ message: "Product Removed From Your Cart", removedItem })
        } else {
            return res.status(404).json("Product Not Found!!!")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}

// increment Quantity
exports.incrementQuantity = async (req, res) => {
    console.log("Inside Increment Quantity API");
    try {
        const { productId } = req.body
        const userId = req.user
        const product = await products.findOne({ _id: productId })
        const existingProduct = await cartModel.findOne({ userId, productId })
        if (existingProduct) {
             // update quantity and original price in cart
             const updatedQuantity = existingProduct.quantity += 1
             const updatedOriginalPrice = parseFloat(updatedQuantity) * parseFloat(product.price)
 
             const updatedProduct = await cartModel.findByIdAndUpdate(existingProduct._id, { quantity: updatedQuantity, originalPrice: updatedOriginalPrice }, { new: true })
            return res.status(200).json(updatedProduct)
        } else {
            return res.status(404).json("Product Not Found!!!")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}

// decrement Quantity
exports.decrementQuantity = async (req, res) => {
    console.log("Inside Increment Quantity API");
    try {
        const { productId } = req.body
        const userId = req.user
        const product = await products.findOne({ _id: productId })
        const existingProduct = await cartModel.findOne({ userId, productId })
        if (existingProduct && existingProduct.quantity > 1) {
             // update quantity and original price in cart
             const updatedQuantity = existingProduct.quantity -= 1
             const updatedOriginalPrice = parseFloat(updatedQuantity) * parseFloat(product.price)
 
             const updatedProduct = await cartModel.findByIdAndUpdate(existingProduct._id, { quantity: updatedQuantity, originalPrice: updatedOriginalPrice }, { new: true })
            return res.status(200).json(updatedProduct)
        } else {
            return res.status(404).json("Product Not Found!!!")
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}

// empty cart
exports.emptyCart = async (req, res) => {
    console.log("Inside Empty Cart API");
    try {
        const { userId } = req.user
        const cart = await cartModel.deleteMany({ userId })
        return res.status(200).json({ message: "Cart emptied", cart })
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message })
    }
}

// add delivery address
// exports.addDeliveryAddress = async (req, res) => {
//     console.log("Inside Add Delivery Address API");
//     try {
//         const { fullName, mobile, pincode, address, city, state, landmark, alternateMobile,addressType } = req.body
//         const userId = req.user

//         //  add address to the deliveryaddress key in the order model
//         const existinAddress = await orders.findOne({ userId, addressType})
//         if(!existinAddress){
//             const newOrder = new orders({
//                 userId,
//                 deliveryAddress: [
//                     {
//                         fullName,
//                         mobile,
//                         pincode,
//                         address,
//                         city,
//                         state,
//                         landmark,
//                         alternateMobile,
//                         addressType
//                     }
//                 ]
//             })
//             await newOrder.save()
//                     }
//         else{
//             const newAddress = {
//                 fullName,
//                 mobile,
//                 pincode,
//                 address,
//                 city,
//                 state,
//                 landmark,
//                 alternateMobile,
//                 addressType
//             }
//             existinAddress.deliveryAddress.push(newAddress)
//             await existinAddress.save()
//         }
//         return res.status(200).json({ message: "Delivery Address Added", exis })
//         } catch (error) {
//         return res.status(500).json({ error: "Internal Server Error", message: error.message })
//     }
// }

exports.addDeliveryAddress = async (req, res) => {
    console.log("Inside Add Delivery Address API");
    try {
        const { fullName, mobile, pincode, address, city, state, landmark, alternateMobile, addressType } = req.body;
        const userId = req.user;
        const newAddress = {
            fullName,
            mobile,
            pincode,
            address,
            city,
            state,
            landmark,
            alternateMobile,
            addressType
        };

        // Check if an order already exists for the user
        const existingOrder = await orders.findOne({ userId });

        if (existingOrder) {
            // Check if the addressType already exists in the deliveryAddress array
            const addressExists = existingOrder.deliveryAddress.some(addr => addr.addressType === addressType);

            if (addressExists) {
                return res.status(400).json("Delivery Address Already exists !!!");
            } else {
                // Add the new address to the existing order
                existingOrder.deliveryAddress.push(newAddress);
                await existingOrder.save();
                return res.status(200).json({ message: "Delivery Address Added", existingOrder });
            }
        } else {
            // Create a new order with the new address
            const newOrder = new orders({
                userId: userId,
                totalAmount: 0,
                deliveryAddress: [newAddress],
                paymentMethod: "COD",
                paymentStatus: "Pending",
                orderStatus: "Processing"
            });
            await newOrder.save();
            return res.status(200).json({ message: "Delivery Address Added", newOrder });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};
