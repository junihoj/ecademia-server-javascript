import mongoose from 'mongoose'

const {Schema} = mongoose
const {ObjectId} = mongoose.Schema

const lessonSchema = new Schema(
    {
        title:{
            type:String,
            trim:true,
            minlength:3,
            maxlength:320,
            required:true,
        }, 
        slug:{
            type:String,
            lowercase:true,
        },
        content:{
            type:{},
            minlength:200
        }, 
        video:{},
        free_preview:{
            type:Boolean,
            default:false,
        }
    },
    {timestamps:true}
);

const courseSchema = new Schema(
    {
        title:{
            type:String,
            trim:true,
            minlength:3,
            maxlength:320,
            required:true,
        }, 
        slug:{
            type:String,
            lowercase:true,
        },
        description:{
            type:{},
            minlength:200,
            require:true,
        },
        price:{
            type:Number,
            default:9.99
        },
        image:{},
        category:String,
        published:{
            type:Boolean,
            default:false,
        },
        paid:{
            type:Boolean,
            default:true,
        },  
        instructor:{
            type:ObjectId,
            ref:"User",
            required:true,
        },  
        lessons:[lessonSchema]
    }, 
    {timestamps:true}
)


export  const Course = mongoose.model('Course', courseSchema)

export const Lessons = mongoose.model('Lesson', lessonSchema)