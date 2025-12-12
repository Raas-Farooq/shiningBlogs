import express from 'express';
import databaseConnection from './config/db.js';
import router from './routes/route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import TestOrigins from './middleware/testOrigins.js';
import { Blog } from './models/model.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:8080', 'http://localhost:5174', 'http://localhost:3000', 'http://172.17.117.48:5173','http://172.17.117.48:5174', 'https://shiningblogs-frontend.onrender.com'];

const corsAuthen = {
    origin:function(requestOrigin , callback){

        if(!requestOrigin || allowedOrigins.includes(requestOrigin)){
            return callback(null, true)
        }
        return callback (new Error("Not allowed by CORS"))
        
    },
    credentials:true
}

app.use(cors(corsAuthen));
app.options(/.*/, cors(corsAuthen));

app.get('/health', async (req, res) => {
  try {
    // Perform a lightweight database query to keep the connection warm
    await Blog.findOne().lean();
    return res.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed :', error);
    return res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});




app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
  return res.send("The backend is Running successfully")
})
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong")
})
app.get('/wake-up', (req, res) => {
  res.send("Waking up...");
});

const port = process.env.PORT || 4100;
databaseConnection()

app.use('/weblog/', router)



app.listen((port), () => console.log("App is running On ", port));

// https://shiningblogs-backend-b4ye.onrender.com
