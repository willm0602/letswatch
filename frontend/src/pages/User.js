import { useLocation, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { UserContext } from '../contextSetup'
import { Box, List, ListItem, Paper, Link, AvatarGroup, Avatar, Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { deleteAccessToken } from '../LocalStorageInterface'
import { padding } from '@mui/system'
import { userMetadata } from '../APIInterface/GetUserData'

const User = () => {
    const [userInfo,setUserInfo] = useState(null)
    const [open, setOpen] = useState(false);
    
    const ctx = useContext(UserContext);

    const handleClick = () => {
        setOpen(!open);
    };
    
    //fixes refresh problem
    useEffect(()=>{
        const setup = async() =>{
            await userMetadata().then(res=> setUserInfo(res));
        }
        setup()
    },[])

    const userLists = [];

    return ( 
        userInfo ?
        <>
            <div
                style = 
                {{
                    paddingBottom: '80px',
                }}
            >    
                <NMHeader />
                <Stack
                    direction = "row"
                    justifyContent= "flex-end"
                    alignItems= "flex-start"
                    spacing = {1.5}
                >
                    <Button
                        variant = "contained"
                        onClick={handleClick}
                        sx={{ backgroundColor: '#6C63FF' }}
                    >
                        Edit
                    </Button>
                    <Dialog
                        open = {open}
                        fullWidth = 'false'
                    >
                        <DialogTitle>
                            Change Bio
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                margin = 'dense'
                                multiline
                                fullWidth
                                maxRows = {3}
                                variant='standard'
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClick}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled
                            >
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button
                        onClick={(e) => {
                            deleteAccessToken()
                            window.location = '/'
                        }}
                        variant = "contained"
                        sx={{ backgroundColor: '#6C63FF' }}
                    >
                        Logout
                    </Button>
                </Stack>
                <div
                    style={{ margin: '0% 5% 5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <img
                            style={{ maxWidth: '100px', borderRadius: '50%' }}
                            src={`/profileImages/${userInfo.profileID}.jpg`}
                        />
                        <p>Date Joined: {userInfo.dateJoined.split('T')[0]}</p>
                    </div>

                    <div style={{ width: '100%', margin: '1% 5%', maxWidth: '227px' }}>
                        <h2>{userInfo.username}</h2>
                        <div
                            style={{
                                backgroundColor: 'rgb(217, 217, 217, 0.25)',
                                textAlign: 'start',
                                height: '150px',
                                width: '227px',
                                padding: '1% 3%',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 'large',
                                    fontFamily: 'sans-serif',
                                }}
                            >{userInfo.bio}</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div
                    style={{
                        margin: '0 5%',
                    }}
                >
                    <h1
                        style={{
                            textAlign:'center' 
                        }}
                    >
                        Lists
                    </h1>
                    <Box style = {{ margin: 'auto', padding}}>
                        <List>
                            {userLists.length === 0 ? (
                                <p style={{ textAlign: 'center'}}> No lists yet :(</p>
                            ) : (
                                <p> Hello There </p>
                            )}
                        </List>
                    </Box>
                </div>
                <div>
                    <h1
                        style = {{
                            textAlign: 'center'
                        }}
                    >
                        Groups
                    </h1>
                    <Box style={{ margin: 'auto'}}>
                        <List>
                            {ctx.userInfo.groups.map((group, index) => (
                                <ListItem key={index}>
                                    <Paper
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '300px',
                                            padding: '4%',
                                            margin: 'auto',
                                            borderRadius: '25px',
                                        }}
                                        elevation={3}
                                    >
                                        <Link
                                            to={`/group/${group.groupID}`}
                                            state={{
                                                group: group,
                                                groupIdx: index,
                                            }}
                                            style={{
                                                margin: 'auto',
                                                textDecoration: 'none',
                                                color: 'black',
                                            }}
                                        >
                                            {group.groupName}
                                        </Link>
                                        <AvatarGroup max={2}>
                                            {group.members.map((member) => (
                                                <Avatar
                                                    alt={member.username}
                                                    src={`/profileImages/${member.profileID}.jpg`}
                                                />
                                            ))}
                                        </AvatarGroup>
                                    </Paper>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </div>
            </div>
            <Footer />
        </>
        :
        <></>//add loading circle thing here later
    )
}

export default User
