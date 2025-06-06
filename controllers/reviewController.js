import Review from "../models/review.js";

export function addReview(req, res){
  if(req.user ==null){
    res.status(401).json({
      message:"please login and try again"
    })
    return
  }
  // console.log(req.body)
  const data =  req.body
  data.name = req.user.firstName + " " + req.user.lastName;
  data.profilePicture= req.user.profilePicture;
  data.email = req.user.email;

  const newReview = new Review(data)

  newReview.save().then(()=>{
    res.status(200).json({
      message:"Review added successfully"
    })
  }).catch((err)=>{
    res.status(500).json({
      message:"Review addition failed"
    })
  })

}


export function getReviews(req, res){
  const user = req.user;

  if(user == null || user.role != "admin"){
    Review.find({isApproved:true}).then((reviews)=>{
      res.status(200).json(reviews)
    })
    return
  }
  if(user.role == "admin"){
    Review.find().then((reviews)=>{
      res.status(200).json(reviews)
    })
  }
}