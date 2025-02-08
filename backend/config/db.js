import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const databaseConnection = async() => {
    // console.log("MONGODB URI ", process.env.MONGODB_URI);
    const connect = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 60000,
        // socketTimeoutMS: 60000,
        // heartbeatFrequencyMS: 30000,
        // retryWrites: true,
        // retryReads: true
    })
    .then(() => {
        
    console.log("Database Connected. Allah(SWT) has been MERciful whenever i called even in School times!");
        
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