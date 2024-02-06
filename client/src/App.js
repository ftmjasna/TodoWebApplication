import React from 'react'
import Signup from './components/signup/Signup'
import Login from './components/login/Login'
import Home from './components/home/Home'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App(){
  return(
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </Router>
  )
}

export default App
