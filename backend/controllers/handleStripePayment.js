const asyncHandler = require("express-async-handler");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingDate");
const {
  shouldRenewSubscriptionPlan,
} = require("../utils/shouldRenewSubscriptionPlan");
const Payment = require("../models/Payment");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// stripe payment

const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  // get user
  const user = req?.user;
  // console.log(user);
  try {
    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "inr",
      // add some data to the mata data to
      //verify the actual user when we call the verification controller
      metadata: {
        userid: user?._id?.toString(), // it is mongodb object id but stripe need a string
        userEmail: user?.email,
        subscriptionPlan,
      },
    });
    console.log(paymentIntent);
    // send the response
    res.json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

//verify payment
const verifyPayment = asyncHandler(async(req,res) => {
    const {paymentId} = req.params
    console.log(paymentId);
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        console.log("from backend verify payment",paymentIntent);
        if(paymentIntent.status === 'succeeded'){
            //get the info metadata
            const metadata = paymentIntent?.metadata;
            const subscriptionPlan = metadata?.subscriptionPlan;
            const userEmail = metadata?.userEmail;
            const userId = metadata?.userid;

            //find the user
            const userFound = await User.findById(userId);
            if(!userFound){
                return res.status(404).json({
                    status:"false",
                    message:'User not found'
                });
            }

            //get payment details
            const amount = paymentIntent?.amount /100;
            const currency = paymentIntent?.currency;
            const paymentId = paymentIntent?.id;

            //create the payment history
            const newPayment = await Payment.create({
                user:userId,
                email:userEmail,
                subscriptionPlan,
                amount,
                currency,
                status: 'success',
                reference:paymentId,
            });

            //check for subscription plan
            if(subscriptionPlan === 'Basic'){
                const updatedUser = await User.findByIdAndUpdate(userId,{
                    subscriptionPlan,
                    trialPeriod : 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount:0,
                    monthlyRequestCount:50,
                    subscriptionPlan:'Basic',
                    trialActive:false,
                    $addToSet: {payments: newPayment?._id}, // to avoid duplication we use $addtoSet
                });

                res.json({
                    status:true,
                    message:"Payment verified, user updated",
                    updatedUser,
                });
            }

            if(subscriptionPlan === 'Premium'){
                const updatedUser = await User.findByIdAndUpdate(userId,{
                    subscriptionPlan,
                    trialPeriod : 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount:0,
                    monthlyRequestCount:100,
                    subscriptionPlan:'Premuim',
                    trialActive:false,
                    $addToSet: {payments: newPayment?._id}, // to avoid duplication we use $addtoSet
                });

                res.json({
                    status:true,
                    message:"Payment verified, user updated",
                    updatedUser,
                });
            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error});
    }
})

// handle free subscription
const handleFreeSubscription = asyncHandler(async (req, res) => {
  // get the login user
  const user = req?.user;

  //check if the user account should be renew or not
  try {
    if (shouldRenewSubscriptionPlan(user)) {
        //update the user account
        user.subscriptionPlan = 'Free';
        user.monthlyRequestCount = 5; //TODO can change later
        user.apiRequestCount = 0;
        user.nextBillingDate = calculateNextBillingDate();//calculate the next billing date
        //create new payment and save into DB
        const newPayment = await Payment.create({
            user:user?._id,
            subscriptionPlan: 'Free',
            amount:0,
            status:"success",
            reference: Math.random.toString(36).substring(7),
            monthlyRequestCount:5,
            trialActive:false,
            currency:'inr',
        });
        user.payments.push(newPayment?._id);
        await user.save();
        //send the response
        return res.json({
            status:'success',
            message:'Subscription plan updated successfully',
            user,
        });  
    }
    else{
        return res.status(403).json({error: 'Subscription renewal is not due yet'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error});
  }
});

module.exports = { handleStripePayment, handleFreeSubscription, verifyPayment };
