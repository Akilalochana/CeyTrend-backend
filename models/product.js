import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  key:{
    type: String,
    required: true,
    unique: true
  },
  name:{
    type: String,
    required: true,
   
  },
  price:{
    type: Number,
    required: true
  },

  category:{
    type:String,
    required: true,
    default: "uncategorized"
  },
  description:{
    type: String,
    required: true
  },
  image:{
    type: [String],
    required: true,
    default: "https://www.shutterstock.com/image-vector/no-image-available-vector-icon-260nw-1502474903.jpg"
  }
});

const Product = mongoose.model("Products", productSchema);

export default Product;