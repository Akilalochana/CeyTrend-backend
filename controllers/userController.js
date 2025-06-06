import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function registerUser(req, res){
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);

  const newUser = new User(data);

  newUser.save().then(()=>{
    res.status(200).json({
      message:"User registered successfully"
    })
  }).catch((err)=>{
    res.status(500).json({
      message:"User registration failed"
    })
  })
}

export function loginUser(req, res){
  const data = req.body;
  User.findOne({
    email:data.email
  }).then((user)=>{
    if(user==null){
      res.status(404).json({
        message:"User not found"
      })

    }else{
     const correctPassword = bcrypt.compareSync(data.password, user.password);

     if(correctPassword){

      const token = jwt.sign({
        name:user.firstName,
        lastName:user.lastName,
        email:user.email,
        role:user.role
      }, process.env.JWT_SECRET)
      
      res.status(200).json({
        message:"User logged in successfully",
        token:token
      })
     }else{
      res.status(401).json({
        message:"login failed!"
      })
     }
    }
  })
}