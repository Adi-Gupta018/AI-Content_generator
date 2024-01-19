const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiRequestLimit = asyncHandler(async (req,res,next) => {
    if(!req.user){
        return res.status(401).json({message: "You are not logged in!"});
    }
    // find the user
    const userF = await User.findById(req?.user?.id); //findone has user.id not user._id
    if(!userF){
        return res.status(404).json({message:"user not found"});
    }
    let requestLimit =0;
    // if(userF?.trialActive){
    //     requestLimit = userF?.monthlyRequestCount;
    // } 
    requestLimit = userF?.monthlyRequestCount;
    // console.log(requestLimit);
    if(userF?.apiRequestCount >= requestLimit){
        throw new Error("API request limit reached, please subscribe to plan");
    }
    next();
})

module.exports = checkApiRequestLimit;