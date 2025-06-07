import express from "express";
import { addProduct, getProducts, updateProducts } from "../controllers/productController.js";


const productRouter = express.Router();

productRouter.post("/",addProduct);
productRouter.get("/",getProducts);
productRouter.put("/:key",updateProducts);

export default productRouter;