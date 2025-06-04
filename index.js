import express, { response } from "express";
import bodyParser from "body-parser";


let app = express();
app.use(bodyParser.json());



app.get("/", (req, res)=>{
  console.log("Hello");
  res.json({message:"Hello"})
})


app.listen(3000, ()=>{
  console.log("Server is running on port 3000 ...");
})