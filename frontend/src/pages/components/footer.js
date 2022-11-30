import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../contextSetup'

import HomeIcon from '@mui/icons-material/Home'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalMoviesIcon from '@mui/icons-material/LocalMovies'
import ListIcon from '@mui/icons-material/List'
import Paper from '@mui/material/Paper'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

const Footer = () => {
    const ctx = useContext(UserContext)
    const fakeData = ctx.fakeDBInfo
    const userInfo = ctx.userInfo

    return (
        <Paper
            sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
            elevation={3}
        >
            <BottomNavigation
                style={{
                    backgroundColor: '#6C63FF',
                }}
            >
                <Link
                    to={`/user/${userInfo.id}`}
                    style={{ display: 'flex' }}
                    state={{
                        userInfo: fakeData,
                    }}
                >
                    <BottomNavigationAction
                        icon={
                            userInfo.profileID !== null ? 
                            <img
                                src={`/profileImages/${userInfo.profileID}.jpg`}
                                style={{
                                    color: 'white',
                                    maxWidth: '30px',
                                    borderRadius: '50%',
                                    border: '1px solid black',
                                }}
                            />
                            :
                            <img style={{maxWidth:'30px', borderRadius:'50%', color:'white', border:'1px solid black'}} src={`https://eu.ui-avatars.com/api/?name=${userInfo.username}&size=250&length=1&background=bdbdbd&color=fff`}/>
                        }
                    />
                </Link>

                <Link to="/media" style={{ display: 'flex' }}>
                    <BottomNavigationAction
                        icon={<LocalMoviesIcon style={{ color: 'white' }} />}
                    />
                </Link>

                <Link to="/" style={{ display: 'flex' }}>
                    <BottomNavigationAction
                        icon={<HomeIcon style={{ color: 'white' }} />}
                    />
                </Link>

                <Link to="/groups" style={{ display: 'flex' }}>
                    <BottomNavigationAction
                        icon={<GroupsIcon style={{ color: 'white' }} />}
                    />
                </Link>

                <Link to="/lists" style={{ display: 'flex' }}>
                    <BottomNavigationAction
                        icon={<ListIcon style={{ color: 'white' }} />}
                    />
                </Link>
            </BottomNavigation>
        </Paper>
    )
}

export default Footer
