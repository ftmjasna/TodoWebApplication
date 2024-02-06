const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const User=require('./model/userModel')
const Todo=require('./model/todoModel')

const app=express()
app.use(express.json())
app.use(cors())

app.listen(4000, (res, req)=>{
    console.log('Server started.')
})

const connect=async()=>{
    await mongoose.connect('mongodb+srv://reelsmallu:mydatabase@cluster0.yhanaxw.mongodb.net/?retryWrites=true&w=majority')
    console.log('Database connected.')
}

connect()

app.post('/signup', async(req, res)=>{
    const user=await User.findOne({email:req.body.email})
    if(!user){
        const result=await User.insertMany([req.body])
        res.json(result)
    }else{
        res.json({status:false})
    }
})

app.post('/login', async(req, res)=>{
    const coll_user=await User.findOne({email:req.body.email})
    if(coll_user==null){
        res.json({status:false})
    }else if(req.body.password===coll_user.password){
        res.json({status:true, email:req.body.email})
    }else{
        res.json({status:false})
    }
})

app.post('/newtodo', async(req, res)=>{
    if(req.body.title.length==0 && req.body.description.length==0){
        res.json({flag:1})
        console.log("Block 1 executed")
    }else if(req.body.title.length>0 && req.body.description.length==0){
        res.json({flag:2})
        console.log("Block 2 executed")
    }else if(req.body.title.length==0 && req.body.description.length>0){
        res.json({flag:3})
        console.log("Block 3 executed")
    }else if(req.body.title.length>0 && req.body.description.length>0){
        res.json({flag:4})
        await Todo.insertMany([req.body])
        console.log("Inserted "+req.body.title+" & "+req.body.description+ " to ToDo list.")
    }else{
        console.log("Error ocurred while adding the task.")
        console.log("Block 5 executed")
    }
})

app.put('/idTodo/:id/:user', async(req, res)=>{
    const task=await Todo.findOne({taskId:req.params.id, user_id:req.params.user})
    res.json({id:task.taskId, title:task.title, description:task.description, mode:'edit'})
})

app.put('/edit/:currentTaskId/:user', async(req, res)=>{
    const test=await Todo.findOneAndUpdate({taskId:req.params.currentTaskId, user_id:req.params.user}, req.body)
    console.log("Edited and inserted "+req.body.title+" & "+req.body.description+ " to ToDo list.")
    res.json({completed:'true'})
})

app.put('/completed/:id', async(req, res)=>{
    const markedTask=await Todo.findOneAndUpdate({taskId:req.params.id, user_id:req.body.user_id}, {isDone:req.body.isDone})
    res.json(markedTask)
})

app.delete('/delete/:id/:user', async(req, res)=>{
    await Todo.findOneAndDelete({taskId:req.params.id, user_id:req.params.user})
    res.json({deletion:'success'})
})

app.get('/display', async(req, res)=>{
    const items=await Todo.find({user_id:req.query.user_id})
    res.json(items.map(item=>({taskId:item.taskId, title:item.title, description:item.description, isDone:item.isDone})))
})