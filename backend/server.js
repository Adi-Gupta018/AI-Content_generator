const express = require("express");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const cors = require("cors"); // since we have two different ports for frontend and backend we need to tell the system that it is safe to access
require('dotenv').config();
const usersRouter = require("./routes/usersRouter");
const router = require("./routes/openAIRouters");
const { errorHandler } = require("./middlewares/errorMiddleware");
const isAuthenticated = require("./middlewares/isAuthenticated");
const connectDB = require("./utils/connectDB");
const stripeRouter = require("./routes/stripeRouter");
const User = require("./models/User");

// Connect to the database
async function startServer() {
  try {
    await connectDB();
    console.log("Connected to the database");

    const app = express();
    const PORT = process.env.PORT || 8090;

    //cron for the trial period run every day
    cron.schedule("0 0 * * * *", async() => {
      try{
        //get the current date
        const today = new Date();
        await User.updateMany({
          trialActive: true,
          trialExpires: {$lt:today},
        },{
          trialActive:false,
          subscriptionPlan: 'Free',
          monthlyRequestCount: 5,
        });

      }
      catch(error){
        console.log(error);
      }
      });

    // cron for the free plan: run at end of every month
    cron.schedule("0 0 1 * * *", async() => {
      try{
        //get the current date
        const today = new Date();
        await User.updateMany({
          subscriptionPlan:'Free',
          nextBillingDate: {$lt:today},
        },{
          monthlyRequestCount: 0,
        });

      }
      catch(error){
        console.log(error);
      }
      });

    //cron for the Basic plan
    cron.schedule("0 0 1 * * *", async() => {
      try{
        //get the current date
        const today = new Date();
        await User.updateMany({
          subscriptionPlan:'Basic',
          nextBillingDate: {$lt:today},
        },{
          monthlyRequestCount: 0,
        });

      }
      catch(error){
        console.log(error);
      }
      });

    //cron schedule for premium
    cron.schedule("0 0 1 * * *", async() => {
      try{
        //get the current date
        const today = new Date();
        await User.updateMany({
          subscriptionPlan:'Premium',
          nextBillingDate: {$lt:today},
        },{
          monthlyRequestCount: 0,
        });

      }
      catch(error){
        console.log(error);
      }
      });

    // Middlewares
    app.use(express.json()); // Parse incoming JSON requests
    app.use(cookieParser()); // Parse cookies
    const corsOptions = {
      origin: "http://localhost:3000", //!frontend url
      credentials: true, //* so that cookies can be passed
    };
    app.use(cors(corsOptions));
    // Routes
    app.use("/api/v1/users", usersRouter);
    app.use("/api/v1/openai", isAuthenticated, router);
    app.use("/api/v1/stripe",stripeRouter);

    // Error handling middleware
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Start the server
startServer();
