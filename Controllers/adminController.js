const adminModel = require('../Models/adminModel')
const productModel = require('../Models/productModel')
const users = require('../Models/userModel')
const categoryModel = require('../Models/categoryModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')
// register
exports.register = async(req,res)=>{
    console.log("Inside Admin Register");
    const {name,email,password} = req.body
    // hash the password
    const hashedPassword = await bcrypt.hash(password,10)
    try {
        const existingAdmin = await adminModel.findOne({email})
        if(existingAdmin){
            res.status(406).json("Admin already exists!!!")
        }else{
            const newAdmin = new adminModel({name,email,password:hashedPassword})
            await newAdmin.save()
            res.status(200).json(newAdmin)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
// login
exports.login = async(req,res) =>{
    console.log("Inside Admin Login");
    const {email,password} = req.body
    console.log(email,password);
    try {
        if(!email || !password){
          return res.status(400).json("All Fields are required")
        }
        const admin = await adminModel.findOne({email})
        if(!admin){
            res.status(401).json("Admin not found")
        }
        // check password
        const matchPassword = await bcrypt.compare(password,admin.password)
        if(!matchPassword){
            res.status(401).json("Wrong Password")
        }
        const token = jwt.sign({id:admin._id},process.env.JWT_ADMIN_SECRET_KEY)
        res.status(200).json({token,admin})
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }
}


// view all registered users
exports.viewAllUsers = async(req,res)=>{
    console.log("Inside View All Users API");
    try {
        const allUsers = await users.find()
        if(!allUsers){
            res.status(404).json("No users found")
        }else{
            res.status(200).json(allUsers)
        }
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }
}

// add products
exports.addProduct = async(req,res)=>{
    console.log("Inside Add Product API");
    const {title,price,category,description} = req.body
    const image = req.file.filename
    try {
        const existingProduct = await productModel.findOne({title,price,category,description})
        if(existingProduct){
            // increment the count by 1
            existingProduct.count+=1;
            existingProduct.image = image
            await existingProduct.save()
            res.status(404).json(existingProduct)
        }else{
            const newCount = 1
            const newProduct = new productModel({
                title,price,category,description,count:newCount,image
            })
            await newProduct.save()
            res.status(200).json(newProduct)
        }
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }
}

// edit product
exports.editproductAPI = async(req,res)=>{
    console.log('Inside Update API');
    const {pid} = req.params
    const {title,price,category,description} = req.body
    const image = req.file.filename
    try {
        const product = await productModel.findById({_id:pid})
        if(!product){
            res.status(401).json("Product not found")
        }
        if(title){
            product.title = title
        }
        if(price){
            product.price = price
        }
        if(category){
            product.category = category
        }
        if(description){
            product.description = description
        }
        if(image){
            product.image = image
        }
        await product.save()
        res.status(200).json({"message":"Product updated successfully",product:product})
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }
}


// get single product by id

exports.getProductById = async(req,res)=>{
    const {pid} = req.params
    console.log("Inside Get Single Product API");
    try{
        const product = await productModel.findById({_id:pid})
        if(product){
            res.status(200).json(product)
        }else{
            res.status(404).json("Product not found")
        }
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }
}

// delete product

exports.deleteProductAPI = async (req, res) => {
    console.log("Inside Delete Product API");
    try {
        const { pid } = req.params;
        console.log(pid);
        const product = await productModel.findById({_id: pid});
        if (!product) {
            return res.status(401).json({ message: "Product not found" });
        }
        if (product.count > 1) {
            // decrement the count by 1
            product.count -= 1;
            await product.save();
            return res.status(200).json({ message: "Product count decremented successfully", product });
        } else {
            // delete the product image from server
            const deletedProduct = await productModel.findByIdAndDelete({_id: pid});
            fs.unlinkSync(`./uploads/${deletedProduct.image}`);
            return res.status(200).json({ message: "Product deleted successfully", deletedProduct });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

// add category

exports.addCategoryAPI = async(req,res)=>{
    console.log("Inside Add Category API");
    const {categoryName} = req.body
    const image = req.file.filename
    try {
        const existingCategory = await categoryModel.findOne({categoryName})
        if(existingCategory){
            res.status(404).json("Category Already Exists")
        }else{
            const newCategory = new categoryModel({
                categoryName, image
            })
            await newCategory.save()
           return res.status(200).json({message:"Category Added Successfully",newCategory})
        }
    } catch (error) {
        res.status(500).json({error:"Internal Server Error", message:error.message})
    }}
// get all categories
exports.getAllCategoriesAPI = async(req,res)=>{
    try {
      const categories = await categoryModel.find()
      if(categories){
       return res.status(200).json(categories)
      } else{
       return res.status(401).json("Categories Not Found")
      } 
    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
    }
}

// update category
exports.editCategoryAPI = async(req,res) =>{
    console.log("Inside Edit Category API")
    const {cid} = req.params
    const {categoryName} = req.body
    const image = req.file.filename
    try {
        const category = await categoryModel.findById({_id:cid})
        if(!category){
            res.status(401).json("Category Not Found")
        }
        if(categoryName){
            category.categoryName = categoryName
        }
        if(image){
            category.image = image
        }
        await category.save()
        res.status(200).json({"message":"Category updated successfully",category})

    } catch (error) {
        return res.status(500).json({error:"Internal Server Error",message:error.message})
  
    }
}

// delete category
exports.deleteCategory = async(req,res) =>{
 console.log("Inside Delete Category API")
 const {cid} = req.params
 try {
    const deletedCategory = await categoryModel.findByIdAndDelete({_id:cid})
    if(deletedCategory){
        fs.unlinkSync(`./uploads/${deletedCategory.image}`);
        res.status(200).json({message:"Category Deleted Successfully",deletedCategory})
    }else{
        res.status(401).json("Category Not Found!!!")
    }
 } catch (error) {
    return res.status(500).json({error:"Internal server Error" , message:error.message})
 }
}


