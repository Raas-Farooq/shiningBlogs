import express from 'express';
import databaseConnection from './config/db.js';
import router from './routes/route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173/',
    credentials:true,
}));
app.use(cookieParser());
const port = process.env.PORT || 4100;
databaseConnection()

app.use('/weblog/', router)



app.listen((port), () => console.log("App is running On ", port));


