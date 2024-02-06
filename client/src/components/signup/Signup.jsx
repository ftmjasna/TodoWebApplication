import { Box, Button, Input, InputLabel, Paper, Stack, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup=()=>{
    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [err,setErr]=useState('')
    const navigate=useNavigate()
     
    useEffect(()=>{
        const userEmail=localStorage.getItem('userEmail')
        if(userEmail){
            navigate('/home')
        }
    }, [])

    const handleUser=(event)=>{
        setUsername(event.target.value)
    }

    const handleEmail=(event)=>{
        setEmail(event.target.value)
    }
    
    const handlePassword=(event)=>{
        setPassword(event.target.value)
    }

    const send=async()=>{
        const result=await axios.post('http://localhost:4000/signup', {username:username, email:email, password:password})
        if(result.data.status===false){
            setErr('Invalid user /User already exists.')
        }else{
            localStorage.setItem('userEmail', result.data[0].email)
            navigate('/home')
        }
    }

    return(
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh',backgroundColor:'grey'}}>
            <Paper sx={{backgroundColor:'ButtonFace', padding:'8vh 5vw',backgroundColor:'lightblue',borderRadius:'35px'}}>
                <Typography variant='h3'>Signup</Typography>
                <Stack width='300px' spacing='2vh' sx={{mt:'5vh'}}>
                    <InputLabel htmlFor='username'>Username</InputLabel>
                    <Input id='username' type='text' onChange={handleUser}/>

                    <InputLabel htmlFor='email'>Email</InputLabel>
                    <Input id='email' type='text' onChange={handleEmail}/>

                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <Input id='password' type='password' onChange={handlePassword}/>

                    <Button onClick={send}  sx={{backgroundColor:'darkblue'}} variant='contained'>Sign Up</Button>

                    <Typography variant='h5' sx={{color:'red'}}>{err}</Typography>
                </Stack>
            </Paper>
        </Box>
    )
}

export default Signup