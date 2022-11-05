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
import { userIsSignedIn } from './LocalStorageInterface'

function App() {
    const ctx = useContext(UserContext) //context works
    const fakeData = ctx.fakeDBInfo

    return (
        <Routes>
            {userIsSignedIn() ? (
                <Route path="/" element={<Home />} />
            ) : (
                <Route path="/" element={<Login />} />
            )}
            <Route path="/group/*" element={<Group />} />
            <Route path="/list/*" element={<List />} />
            <Route path="/user/*" element={<User />} />
            <Route path="/media" element={<ManyMedia />} />
        </Routes>
    )
}

export default App
