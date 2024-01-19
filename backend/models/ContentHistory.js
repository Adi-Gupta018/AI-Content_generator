const mongoose = require('mongoose')

//schema
const historySchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    content:{
        type: String,
        required:true,
    },
},
{
    timestamps: true // Saves createdAt and updatedAt as dates. CreatedAt will be saved with the date the document was created
},
);

//! compile to form model
const ContentHistory = mongoose.model('contentHistory',historySchema);
module.exports = ContentHistory;