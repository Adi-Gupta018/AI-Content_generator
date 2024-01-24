const User = require("../models/User.js");
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// TODO: Registration
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  //validate
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }
  // unique email
  const userExits = await User.findOne({ email });
  if (userExits) {
    res.status(400);
    throw new Error("Email is already taken");
  }
  //Hash user password
  const salt = await brcypt.genSalt(10);
  const hashedPassword = await brcypt.hash(password, salt);

  // create user
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  //Add the date when trial ends
  newUser.trialExpires = new Date(
    new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
  );
  // save the user
  await newUser.save();
  res.json({
    status: true,
    message: "Registration was successful",
    user: {
      username,
      email,
    },
  });
});
// TODO: Login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Validate
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  const isMatch = await brcypt.compare(password, user?.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  // generate token(JWT)
  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: "3d", //token expires in 3days
  });
  //set the token into cookie (http only)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: None, //! changed from strict to None,
    // domain:".onrender.com", //! remove if not works
    // maxAge: 24 * 60 * 60 * 1000, //1 day
  });
  //send the respond
  res.json({
    status: "success",
    _id: user?._id,
    message: "Login successful",
    username: user?.username,
    email: user?.email,
  });
});
// TODO: Logout
const logout = asyncHandler(async (req, res) => {
  //remove the token from clint side
  res.clearCookie("token");
  //redirect to home page
  res.status(200).json({ message: "Logout successfully" });
});
// TODO: Profile
const userProfile = asyncHandler(async (req, res) => {
  const id = req.user?._id; // check isAuthenticated middleware
  const user = await User.findById(id)
        .select("-password")
        .populate("payments")
        .populate("contentHistory");
  if (user) {
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// TODO: Check user Auth Status
const checkAuth = asyncHandler(async(req,res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if(decoded){
    res.json({
      isAutheticated: true,
    });
  } else{
    res.json({
      isAutheticated:false,
    });
  }
});

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
