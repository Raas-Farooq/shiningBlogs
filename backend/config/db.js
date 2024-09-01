import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async() => {
    // console.log("MONGODB URI ", process.env.MONGODB_URI);
    const connect = mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        
        console.log("Database Connected");
        
})
    .catch(err => console.log("Error while connection MongoDb (database): ", err));

    return connect
}


export default databaseConnection
// qbhUHReXDDRWVtAg