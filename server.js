import express from 'express';
import db from './db.js'
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import jwtAuth from './middleware/jwtAuth.js';
import Candidate from './models/candidate.js';

dotenv.config();

const app = express();

//this work as similar as body-parser
app.use(express.json());

//
app.get('/',(req,res)=>{
    res.send("Hello this is voting application");
});

//user routes
app.use('/User',userRoutes);
app.use('/candidate',candidateRoutes)

//
const PORT = process.env.PORT || 3000;


//app listen 
app.listen(PORT,()=>{
    console.log("server is running on http://localhost:",PORT);
});

