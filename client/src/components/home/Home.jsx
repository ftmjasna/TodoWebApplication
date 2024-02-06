import { Box, Button, Card, CardContent, Input, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

var taskId=1;

const Home=()=>{
    const [email, setEmail]=useState('')
    const [currentTaskId, setCurrentTaskId]=useState('0')
    const [title, setTitle]=useState('')
    const [description, setDescription]=useState('')
    const [todos, setTodos]=useState([])
    const [taskMode, setTaskMode]=useState('add')
    const [isDone, setIsDone]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(!userEmail){
            navigate('/login')
        }else{
            setEmail(userEmail)
        }
        loadDisplayAPI()
    }, [{title, description}])

    const loadDisplayAPI=async()=>{
        const result=await axios.get("http://localhost:4000/display",{params:{user_id:localStorage.getItem('userEmail')}})
        setTodos(result.data)
    }

    const logout=()=>{
        localStorage.removeItem('userEmail')
        navigate('/login')
    }

    const handleTitle=(event)=>{
        setTitle(event.target.value)
    }

    const handleDescription=(event)=>{
        setDescription(event.target.value)
    }

    const submitToDo=async()=>{
        const Todo=await axios.post('http://localhost:4000/newtodo',{taskId:todos.length+1, user_id:localStorage.getItem('userEmail'), title:title, description:description, isDone:isDone})
        if(Todo.data.flag===1){
            alert("Please enter a title and description for the todo")
        }else if(Todo.data.flag===2){
            alert("Please enter a description for the todo")
        }else if(Todo.data.flag===3){
            alert("Please enter a title for the todo")
        }else if(Todo.data.flag===4){
            alert("Todo successfully added to do list!")
        }else{
            alert("Some error occured!:/")
        }
        setTitle('')
        setDescription('')
    }

    function editTask(id){
        const edit=async()=>{
           const identifiedTodo=await axios.put(`http://localhost:4000/idTodo/${id}/${localStorage.getItem('userEmail')}`)
           setTaskMode(identifiedTodo.data.mode)
           taskId=identifiedTodo.data.id
           setCurrentTaskId(identifiedTodo.data.id)
           setTitle(identifiedTodo.data.title)
           setDescription(identifiedTodo.data.description)
        }
        return()=>{
            edit()
        }
    }

    const editTodo=async()=>{
        const currentTodo=await axios.put(`http://localhost:4000/edit/${currentTaskId}/${localStorage.getItem('userEmail')}`, {taskId:currentTaskId, title:title, description:description})
        if(currentTodo.data.completed=='true'){
            alert("Todo successfully edited!")
            setTaskMode('add')
            setTitle('')
            setDescription('')
        }else{
            alert("Todo edit failed :(")
            setTaskMode('add')
            setTitle('')
            setDescription('')
        }
    }

    function markTask(id){
        const markAsCompleted=async()=>{
           await axios.put(`http://localhost:4000/completed/${id}`, {user_id:localStorage.getItem('userEmail'), isDone:true})
        }
        return()=>{
            markAsCompleted()
        }
    }
    
    function deleteTask(id){
        const deleteTodo=async()=>{
            const deletedTodo=await axios.delete(`http://localhost:4000/delete/${id}/${localStorage.getItem('userEmail')}`, {deleted:true})
            if(deletedTodo.data.deletion=='success'){
                taskId=todos.length
            }else{
                alert('Delete failed')
            }
        }
        return()=>{
            deleteTodo()
        }
    }

    return(
        <Box>
            <Box sx={{display:'flex', justifyContent:'space-between', flexDirection:'column', backgroundColor:'black'}}>
                <Box sx={{display:'flex', justifyContent:'center'}}>
                    <Card sx={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'30vh', width:'95%',backgroundColor:'lightblue'}}>
                        <CardContent sx={{display:'flex', justifyContent:'space-between'}}>  
                            <Box sx={{ml:'35vw', mr:'38vw'}}>
                                <Typography variant='h2' sx={{display:'flex', justifyContent:'center', fontSize:'30px'}}>Welcome Home!</Typography>
                                <Typography variant='h3' component='div' sx={{fontSize:'20px'}}>{email}</Typography>
                            </Box>
                            <Button onClick={logout} variant='contained'>Logout</Button>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{display:'flex', justifyContent:'center', marginTop:'5vh'}}>
                    {taskMode=='add'?
                        <Card sx={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'30vh', width:'95%',backgroundColor:'lightblue'}}>
                            <CardContent>
                                <Typography variant='h3' sx={{textAlign:'center'}}>To-Do List</Typography>
                                <Input variant='outlined' onChange={handleTitle} type='text' value={title} placeholder=' Enter the to do title here:' sx={{width:'100%', marginTop:'2vh'}}/><br/>
                                <Input variant='outlined' onChange={handleDescription} value={description} minRows={5} placeholder=' Enter the to do here:' sx={{width:'45vw', marginTop:'2vh'}}/><br/>
                                <Button onClick={submitToDo} variant='contained' sx={{marginTop:'2vh'}}>Add To Do</Button>
                            </CardContent>
                        </Card>
                        :
                        <Card sx={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'30vh', width:'95%'}}>
                            <CardContent>
                            <Typography variant='h3' sx={{textAlign:'center'}}>To-Do List</Typography>
                                <Input variant='outlined' onChange={handleTitle} type='text' value={title} placeholder=' Enter the to do title here:' sx={{width:'100%', marginTop:'2vh'}}/><br/>
                                <Input variant='outlined' onChange={handleDescription} value={description} minRows={5} placeholder=' Enter the to do here:' sx={{width:'45vw', marginTop:'2vh'}}/><br/>
                                <Button onClick={editTodo} variant='contained' sx={{marginTop:'2vh'}}>Edit To Do</Button>
                            </CardContent>
                        </Card>
                    }
                </Box> 

                <Box sx={{display:'flex', justifyContent:'center', backgroundColor:'Black', marginTop:'5vh'}}>
                    <Card sx={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'30vh', width:'95%',backgroundColor:'#263840'}}>  
                        <CardContent sx={{width:'100%'}}>
                            <ul sx={{width:'95%'}}>
                                {todos.map((todo)=>(
                                    <li key={todo.title} style={{listStyle:'none', backgroundColor:'rgba(200, 200, 200, 0.5)', width:'100%'}}>
                                        {todo.isDone==true?<h2 style={{textDecoration:'line-through', paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.title}</h2>:<h2 style={{paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.title}</h2>}
                                        {todo.isDone==true?<p style={{textDecoration:'line-through', paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.description}</p>:<p style={{paddingLeft:'1vw', paddingTop:'1vh'}}>{todo.description}</p>}
                                        {todo.isDone==true?<button disabled>Edit</button>:<button onClick={editTask(todo.taskId)} >Edit</button>}
                                        {todo.isDone==true?<button disabled>Mark as Completed</button>:<button onClick={markTask(todo.taskId)}>Mark as Completed</button>}
                                        {todo.isDone==true?<button onClick={deleteTask(todo.taskId)}>Delete</button>:<button disabled>Delete</button>}
                                    </li>
                                ))} 
                            </ul>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Box>
    )
}

export default Home