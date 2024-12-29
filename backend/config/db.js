import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async() => {
    // console.log("MONGODB URI ", process.env.MONGODB_URI);
    const connect = mongoose.connect(process.env.MONGODB_URI, {
        // serverSelectionTimoutMS:5000,
        connectTimeoutMS:10000
    })
    .then(() => {
        
        console.log("Database Connected. Hooo!");
        
})
    .catch(err => {
        console.log("Error while connection MongoDb (database): ", err);
        setTimeout(databaseConnection, 5000)
    })
    return connect
}

mongoose.connection.on(('error'), err => {
    console.error("Error during connection: ", err)
})

export default databaseConnection
// qbhUHReXDDRWVtAg