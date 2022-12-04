import './App.css'
import React, { useContext } from 'react'
import { UserContext } from './contextSetup'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Group from './pages/Group'
import List from './pages/List'
import User from './pages/User'
import Groups from './pages/Groups'
import Lists from './pages/Lists'
import ManyMedia from './pages/ManyMedia'
import { userIsSignedIn } from './LocalStorageInterface'
import { userMetadata } from './APIInterface/GetUserData'
import { allMedia } from './APIInterface/MediaSearch'
import SingleMedia from './pages/SingleMedia'
import FriendPage from './pages/Friend'

function App() {
    const ctx = useContext(UserContext) //context works

    //set user information from the db into context
    if (!ctx.userInfo) userMetadata().then((res) => ctx.setUserInfo(res));
    if (!ctx.autoFillMedia) allMedia().then((res) => ctx.setAutoFillMedia(res));

    return (
        <Routes>
            {userIsSignedIn() ? (
                <>
                    <Route path="/" element={<Home />} />
                    <Route path="/group/:groupID" element={<Group />} />
                    <Route path="/list/:listID" element={<List />} />
                    <Route path="/list/:groupID/:listID" element={<List />} />
                    <Route path="/lists" element={<Lists />} />
                    <Route path="/user/:userID" element={<User />} />
                    <Route path="/media" element={<ManyMedia />} />
                    <Route path="/media/:tmdbID" element={<SingleMedia />} />
                    <Route path="/media/:mediaType/:tmdbID" element={<SingleMedia />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/user/friend/:userID" element={<FriendPage />} />
                </>
            ) : (
                <Route path="/" element={<Login />} />
            )}
        </Routes>
    )
}

export default App
