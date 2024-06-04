//TODO: NPM INSTALL STRIPE QUERY-STRING
import User from '../models/user'
import {Course} from '../models/course'

// import stripe from 'stripe'
import QueryString from 'query-string'
import Banks from './response.json'

const flutterwave = require('flutterwave-node-v3')

const flw = new flutterwave(process.env.FLW_PB_KEY, process.env.FLW_SECRET_KEY)
const stripe = require('stripe')(process.env.STRIPE_SECRET)
export const makeInstructor = async (req, res)=>{
   try{
        // 1. find user from db 
        const user = await User.findById(req.user._id).exec()

        // 2. if user don't have stripe_account_id yet, then create new
        if(!user.stripe_account_id){
            const account = await stripe.accounts.create({type:"express"});
            // console.log('ACCOUNT=>', account.id)
            user.stripe_account_id = account.id;
            user.save();
        }
        //3.  create account link based on account id (for frontend to complete onboarding)
        let accountLink = await stripe.accountLinks.create({
            account: user.stripe_account_id,
            refresh_url:process.env.STRIPE_REDIRECT_URL, 
            return_url:process.env.STRIPE_REDIRECT_URL,
            type:"account_onboarding",
        })
        // 4. pre-fill any info such as email(Optional), then send url response to frontend
        accountLink = Object.assign(accountLink, {
            "stripe_user[email]": user.email
        })
        // 5. then send the account link as response to frontend

        res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);


   }catch(err){
        console.log("Make Instructor Err", err)
   }

}


export const getAccountStatus = async (req, res)=>{
    try {
        const user = await User.findById(req.user._id).exec()
        const account  = await stripe.accounts.retrieve(user.stripe_account_id)
        console.log('ACCOUNT=>', account)

        if(!account.charges_enabled){
            return res.status(401).send("unauthorized")
        }else{
            const statusUpdated = await User.findByIdAndUpdate(user._id, {
                stripe_seller: account, 
                $addToSet:{role: "Instructor"},
            },
                {new:true}
            ).select('-password').exec()

            res.json(statusUpdated);
        }
    } catch (error) {
        console.log(err)
    }
}


export const makeInstructorFlutter = async (req, res)=>{
    try{
        const user = await User.findById(req.user._id).exec()

        let payload = req.body

        payload = Object.assign(payload, {
            "split_type": "percentage", 
            "split_value": 0.3
        })
        console.log(payload)

        const response = await flw.Subaccount.create(payload)
        console.log(response)

        /* 
            1. if creating subaccount is successful 
            2. query flutterwave for information of the user
            3. update the user the user information in database
            4. send the updated information to the frontend
        */
        if(response.status == 'success'){
            const flutter_id = {
                "id" :response.data.id
            }

            try{
                const flw_user_info = await flw.Subaccount.fetch(flutter_id)
                console.log(flw_user_info)
                const updatedStatus = await User.findByIdAndUpdate(user._id, {
                    flw_seller: flw_user_info.data,
                    flw_account_id: response.data.id,
                    $addToSet:{role: "Instructor"}
                },
                {new:true}
                ).select("-password").exec()
                
                console.log("FLW_USER_INFO", flw_user_info)

                //send updated status to fronend
                res.json(updatedStatus)

            }catch(err){
                console.log(err)
            }
        }
        
    }catch(err){
        console.log(err)
    }
}

export const getBank = async (req, res)=>{
    console.log("I was hit")
    try { 
        const payload = {
            "country": req.body.ISO_CODE
        }
        const response = await flw.Bank.country(payload)
        res.json({Banks: response})
    }catch(err){
        console.log(err)
    }
}




export const currentInstructor = async (req,res)=>{
 try{
   let user = await User.findById(req.user._id).select('-password').exec()
     console.log(user)


     if(!user.role.includes('Instructor')){
         console.log("not included")
        return res.sendStatus(403)
     }else{
         console.log('Instructor')
        return res.json({user, ok:true}); 
     }
     

 }catch(err){
    console.log(err)
 }
}


export const instructorCourses = async (req,res)=>{
    try{
        console.log(req.user._id)
        const courses = await Course.find({instructor:req.user._id})
            .sort({createdAt: -1})
            .exec()

        res.json(courses)
    }catch(err){
        console.log(err)
    }
}



