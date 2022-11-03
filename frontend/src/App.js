import './App.css'
import React, { useContext } from 'react'

import { UserContext } from './contextSetup'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Group from './pages/Group'
import List from './pages/List'
import User from './pages/User'
import ManyMedia from './pages/ManyMedia'
import {userIsSignedIn} from './LocalStorageInterface'
import { userMetadata } from './APIInterface/GetUserData'

function App() {
    const ctx = useContext(UserContext) //context works

    //set user information from the db into context
    if(!ctx.userInfo)
      userMetadata().then((res) => ctx.setUserInfo(res))

    return (
        <Routes>
            {userIsSignedIn() ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/group/*" element={<Group />} />
                  <Route path="/list/*" element={<List />} />
                  <Route path="/user/*" element={<User />} />
                  <Route path="/media" element={<ManyMedia />} />
                </>
            ) : (
                <Route path="/" element={<Login />} />
            )}
            
        </Routes>
    )
}

export default App
