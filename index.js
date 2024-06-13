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

const whitelist = [`${process.env.CLIENT_URL}`]
const  corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
}


//apply middlewares
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     res.setHeader(
//       "Access-Control-Allow-Origin",
//       `${process.env.CLIENT_URL}`
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//     );
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     res.setHeader("Access-Control-Allow-Private-Network", true);
//     //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//     res.setHeader("Access-Control-Max-Age", 7200);
  
//     next();
// });



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

