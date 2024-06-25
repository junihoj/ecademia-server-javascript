import express from 'express';
import {readdirSync} from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
import { corsPolicy } from './config/cors';
// import { Db } from 'mongodb';
const morgan = require('morgan');
require("dotenv").config();
var cookieParser =require('cookie-parser');
var csrf = require('csurf');

const csrfProtection= csrf({cookie:true});

//create express app
const app = express();
app.options('*', corsPolicy)
app.use(corsPolicy);
//cookie-parser middleware

app.use(cookieParser());
// app.use(csrfProtection);

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

// app.options("*", corsPolicy)
//apply middlewares


app.use(express.json({limit:'5mb'}));

app.use(morgan("dev"));

//route

readdirSync('./routes').map((r)=> 
    app.use('/api', require(`./routes/${r}`))
);
// app.get('/', (req,res)=>{
//     res.send("I have hit the server endpoint");
// });


app.get("/healthz", (req, res) => {
    console.log("health check is processed");
    return res.status(204).send();
});
const port = process.env.PORT || 8000;

app.listen(port, ()=>console.log(`Server is running on port ${port}`));

