import bcrypt from 'bcryptjs'

// export const hashPassword = (password)=>{
//     return new Promise((resolve, reject)=>{
//         //genSalt firt argument for the strength
//         bcrypt.genSalt(12, (err,salt)=>{
//             if(err){
//                 reject(err)
//             }
//             bcrypt.hash(password, salt, (err,hash)=>{
//                 if(err){
//                     reject(err);
//                 }
//                 resolve(hash);
//             });
//         });
//     }); 
// }

// export const comparePassword = (password, hashed)=>{
//     return bcrypt.compare(password,hashed);
// }

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
}