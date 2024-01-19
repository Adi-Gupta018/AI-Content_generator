const mongoose = require('mongoose')
const moment = require('moment')
//schema
const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,'Please provide a Username']
    },
    email:{
        type: String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    trialPeriod:{
        type:Number,
        default:3,
    },
    trialActive:{
        type:Boolean,
        default:true,
    },
    trialExpires:{
        type:  Date,
    },
    subscriptionPlan:{
        type:String,
        enum:['Trial',"Free",'Basic','Premium'],
        default: "Trial"
    },
    apiRequestCount:{
        type:Number,
        default:0,
    },
    monthlyRequestCount:{
        type:Number,
        default:100,//100 credits to use // 3 days
    },
    nextBillingDate:{
        type:Date,  
    },
    payments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Payment"
        }
    ],
    contentHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"contentHistory"
        }
    ],
},
{
    timestamps: true, // Saves createdAt and updatedAt as dates. CreatedAt will be saved with the date the document was created
    toJSON:{virtuals:true},
    toObject:{virtuals:true}, // both helps to populate isTrialActive
}
);

// // Add virtual property
// userSchema.virtual("isTrialActive").get(function(){
//     return this.trialActive && moment().isBefore(this.trialExpires) ? true : false; // this keyword to access the current user
// })

//! compile to form model
const User = mongoose.model('User',userSchema);
module.exports = User;