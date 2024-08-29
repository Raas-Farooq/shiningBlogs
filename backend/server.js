import express from 'express';
import databaseConnection from './config/db.js';
import router from './routes/route.js';
const app = express();

app.use(express.json());

// console.log("router : ", router);
console.log("Server App is Running!");
const port = process.env.PORT || 4100;
databaseConnection()

app.use('/weblog/', router)



app.listen((port), () => console.log("App is running On ", port));


