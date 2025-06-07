import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req, res) {
  try {
    console.log("Request user:", req.user); // Debug log
    console.log("Request body:", req.body); // Debug log

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Please login to submit an inquiry"
      });
    }

    // Check if user is a customer (await if it's async)
    const customerCheck = await isItCustomer(req); // Add await if isItCustomer is async
    if (!customerCheck) {
      return res.status(403).json({
        message: "Only customers can submit inquiries"
      });
    }

    const data = req.body;

    // Validate required fields
    if (!data.message || data.message.trim() === "") {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    // Set user email and phone from authenticated user
    data.email = req.user.email;
    data.phone = req.user.phone;

    // Generate ID
    let id = 1;
    const lastInquiry = await Inquiry.findOne().sort({ id: -1 }).limit(1);
    
    if (lastInquiry) {
      id = lastInquiry.id + 1;
    }

    data.id = id;

    console.log("Creating inquiry with data:", data); // Debug log

    const newInquiry = new Inquiry(data);
    const response = await newInquiry.save();

    res.status(201).json({
      message: "Inquiry added successfully",
      id: response.id,
      inquiry: response
    });

  } catch (error) {
    console.error("Error adding inquiry:", error); // Proper error logging
    
    // Handle duplicate ID error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Inquiry ID conflict. Please try again."
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }))
      });
    }

    res.status(500).json({
      message: "Failed to add inquiry",
      error: error.message
    });
  }
}

export async function getInquiries(req, res) {
  try{
    if(isItCustomer(req)){
      const inquiries = await Inquiry.find({email: req.user.email})
      res.json(inquiries);
      return
    }else if(isItAdmin(req)){
      const inquiries = await Inquiry.find();
      res.json(inquiries);
      return
    }else{
      res.json({message:"You are not authorized to view inquiries"});
    }

  }catch(e){
    res.status(500).json({
      message: "Failed to fetch inquiries",
      error: e.message
    });

  }
}


export async function deleteInquiry(req, res){
  try{
    if(isItAdmin(req)){
      const id = req.params.id;

      await Inquiry.deleteOne({id:id});
      res.json({
        message:"Inquiry deleted successfully"
      });
      return
    }else if(isItCustomer(req)){
      const id = req.params.id;
      const inquiry = await Inquiry.findOne({id:id});
      if(inquiry == null){
        res.json({
          message:"Inquiry not found"
        });
        return
      }else{
        if(inquiry.email == req.user.email){
          await Inquiry.deleteOne({id:id});
          res.json({
            message:"Inquiry deleted successfully"
          });
          return
        }else{
          res.json({
            message:"You are not authorized to delete this inquiry"
          });
          return
        }
      }
    }else{
      res.json({
        message:"You are not authorized to delete inquiries"
      });
    }
    


  }catch(e){
    res.status(500).json({
      message: "Failed to delete inquiry",
      error: e.message
    });
  }
}

export async function updateInquiry(req, res){
  try{
    if(isItAdmin(req)){
      const id = req.params.id;
      const data = req.body;
      await Inquiry.updateOne({id:id},{$set:data});
      res.json({
        message:"Inquiry updated successfully"
      });
      return
    }else if(isItCustomer(req)){
      const id = req.params.id;
      const data = req.body;
      const inquiry = await Inquiry.findOne({id:id});
      if(inquiry == null){
        res.json({
          message:"Inquiry not found"
        });
        return
      }else{

        if(inquiry.email == req.user.email){

          await Inquiry.updateOne({id:id},{message:data.message});
          res.json({
            message:"Inquiry updated successfully"
          });
          return
        }else{
          res.json({
            message:"You are not authorized to update this inquiry"
          });
          return
        }

    }
  }else{
    res.json({
      message:"You are not authorized to update inquiries. plz login and try again"
    });
  }

  }catch(e){
    res.status(500).json({
      message: "Failed to update inquiry",
      error: e.message
    });
  }
}