import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  name:{
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  date:{
    type: Date,
    required: true,
    default: Date.now()
  },
  profilePicture: {
    type: String,
    required: true,
    default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;