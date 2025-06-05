import Product from "../models/product.js";

export function addProduct(req, res) {
  console.log(req.user)



  if(req.user == null){
    res.status(401).json({
      message:"please login and try again"
    })
    return
  }
  if (req.user.role !== "admin") {
    res.status(403).json({
      message: "You are not authorized to add a product",
    });
    return;
  }

  const data = req.body;
  const newProduct = new Product(data);

  newProduct.save().then(() => {
    res.status(200).json({
      message: "Product added successfully",
    });

  }).catch((err) => {
    res.status(500).json({
      message: "Product addition failed",
    });
  });
}