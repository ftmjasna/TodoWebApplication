const { internal_resolveProps } = require('@mui/utils')
const mongoose=require('mongoose')

const todoSchema=new mongoose.Schema({
    taskId:{
        type:Number,
        Integer:true
    },
    title:{
        type:String,
        required:false
    },
    description:{
        type:String,
        required:false
    },
    user_id:{
        type:String,
        required:false
    },
    isDone:{
        type:Boolean,
        required:false
    }
})

const Todo=mongoose.model('todo', todoSchema)
module.exports=Todo