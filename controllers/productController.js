import Product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export async function addProduct(req, res) {
  console.log(req.user);

  if(req.user == null){
    res.status(401).json({
      message:"Please login and try again"
    });
    return;
  }
  
  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "You are not authorized to add a product",
    });
    return;
  }

  try {
    const data = req.body;
    
    // Check if product with same key already exists
    const existingProduct = await Product.findOne({ key: data.key });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this key already exists"
      });
    }

    const newProduct = new Product(data);
    await newProduct.save();
    
    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });

  } catch (err) {
    console.error("Error adding product:", err);
    
    // Handle duplicate key error specifically
    if (err.code === 11000) {
      return res.status(409).json({
        message: "Product with this key already exists"
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors
      });
    }
    
    res.status(500).json({
      message: "Product addition failed",
      error: err.message
    });
  }
}

export async function getProducts(req, res){
  try{
    const products = await Product.find();
    res.json(products);
  } catch(err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      message: "Failed to fetch products",
      error: err.message
    });
  }
}



export async function updateProducts(req, res){
  try{
    if(isItAdmin(req)){
      const key = req.params.key;

      const data = req.body;
      await Product.updateOne({key:key},{$set:data});

      res.json({message:"Product updated successfully"});
    }else{
      res.json({message:"You are not authorized to update products"});
    }

  }catch(err){
    res.status(500).json({
      message: "Failed to update products",
      error: err.message
    });
  }
}

export async function deleteProducts(req, res){
  try{
    if(isItAdmin(req)){
      const key = req.params.key;
      await Product.deleteOne({key:key});
      res.json({message:"Product deleted successfully"});
    }else{
      res.json({message:"You are not authorized to delete products"});
    }

  }catch(e){
    res.status(500).json({
      message: "Failed to delete products",
     
    });
  }
}