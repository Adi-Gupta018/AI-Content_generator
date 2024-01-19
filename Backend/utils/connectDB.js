const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect('mongodb+srv://Demo03:Demomongo03@demo.antwhfs.mongodb.net/AI-content-generator?retryWrites=true&w=majority');
        console.log(`MongoDb connected ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;