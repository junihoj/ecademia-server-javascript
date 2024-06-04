import express from 'express';
import {readdirSync} from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
// import { Db } from 'mongodb';
const morgan = require('morgan');
require("dotenv").config();
var cookieParser =require('cookie-parser');
var csrf = require('csurf');

const csrfProtection= csrf({cookie:true});

//create express app
const app = express();

//cookie-parser middleware

app.use(cookieParser());
app.use(csrfProtection);

//Database
mongoose.connect(process.env.DATABASE, {
    // userNewUrlParser:true,
    // useFindAndModify:false,
    // useUnifiedTopology:true,
    // useCreateIndex:true,
}).then(()=>console.log('DB CONNECTED'))
    .catch((err)=>console.log(err));


// var db = mongoose.connection;

// db.once('open', function(){
// 	console.log("connected successfully");
// });

// db.on('error', function(err){
// 	console.log(err);
// });



//apply middlewares
app.use(cors());

app.use(express.json({limit:'5mb'}));

app.use(morgan("dev"));

//route

readdirSync('./routes').map((r)=> 
    app.use('/api', require(`./routes/${r}`))
);
// app.get('/', (req,res)=>{
//     res.send("I have hit the server endpoint");
// });



const port = process.env.PORT || 8000;

app.listen(port, ()=>console.log(`Server is running on port ${port}`));

