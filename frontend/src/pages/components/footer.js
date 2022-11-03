import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../contextSetup'

import HomeIcon from '@mui/icons-material/Home'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalMoviesIcon from '@mui/icons-material/LocalMovies'
import ListIcon from '@mui/icons-material/List'
import Face4Icon from '@mui/icons-material/Face4'
import Paper from '@mui/material/Paper'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

const Footer = () => {
    const ctx = useContext(UserContext)
    const fakeData = ctx.fakeDBInfo
    const userInfo = ctx.userInfo;

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
                            <img
                                src={`/profileImages/${userInfo.profileID}.jpg`}
                                style={{
                                    color: 'white',
                                    maxWidth: '30px',
                                    borderRadius: '50%',
                                    border: '1px solid black',
                                }}
                            />
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

                <BottomNavigationAction
                    icon={<GroupsIcon style={{ color: 'white' }} />}
                />
                <BottomNavigationAction
                    icon={<ListIcon style={{ color: 'white' }} />}
                />
            </BottomNavigation>
        </Paper>
    )
}

export default Footer
