import express from 'express';
import databaseConnection from './config/db.js';
import router from './routes/route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://shiningblogs-frontend.onrender.com'];

// app.use(cors({
//     origin:function (origin, callback){
//         if(allowedOrigins.includes(origin) || !origin){
//             callback(null, true)
//         }else{
//             callback(new Error('Not allowed by Cors or Not a Valid Origin'))
//         }
//     },
//     credentials:true,
// }));

app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))

app.use(express.json({strict:false}));
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.get('/', (req,res) => {
    return res.send("The backend is Running successfully")
})
app.use((err, req,res, next) => {
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


