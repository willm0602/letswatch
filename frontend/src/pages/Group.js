import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'

import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'

import * as React from 'react'
import Modal from '@mui/material/Modal'

import { useContext } from 'react'
import { UserContext } from '../contextSetup'
import { TextField } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';

//API stuff
import { makeWatchList } from '../APIInterface/WatchList'
import { userMetadata } from '../APIInterface/GetUserData'
import { getFriends, addFriendToGroup } from '../APIInterface/Friendships'
import AddCircle from '@mui/icons-material/AddCircle'

const Group = () => {
    const location = useLocation()
    const [groupInfo, setGroupInfo] = React.useState(location.state.group)
    const ctx = useContext(UserContext)
    const [open, setOpen] = React.useState(false)
    const [newListName, setNewListName] = React.useState('')
    const handleOpen = () => setOpen(true)
    const [friendsList, setFriendsList] = React.useState(null);
    const [intermediateFriendsList, setIntermediateFriendsList] = React.useState(friendsList);
    const [openSnackBar, setOpenSnackBar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const handleCloseSnackBar = () => setOpenSnackBar(false);

    const handleOpenSnackBar = (friendID) => {
        const friendAdded = friendsList.filter(friend => friend.id === friendID)[0]
        setSnackbarMessage(`${friendAdded.username} was added to the group!`)
        setOpenSnackBar(true)
    }
    

    const [openFriendModal, setOpenFriendModal] = React.useState(false);
    const handleOpenFM = () => {
        setIntermediateFriendsList(friendsList);
        setOpenFriendModal(true);
    };
    const handleCloseFM = () => setOpenFriendModal(false);

    const handleClose = () => {
        setOpen(false)
        setNewListName('')
    }

    const handleAddList = () => {
        handleOpen()
    }

    const handleInputChange = (event) => {
        setNewListName(event.target.value)
    }

    const handleCreateList = () => {
        const createNewList = async () => {
            await makeWatchList(
                newListName,
                ctx.userInfo.groups[location.state.groupIdx].groupID
            ).then((res) =>
                userMetadata().then((res) => {
                    ctx.setUserInfo(res)
                    setGroupInfo(res.groups[location.state.groupIdx])
                })
            )
        }
        createNewList()
        //functions as no-op?
        userMetadata().then((res) => console.log(res))
        handleClose()
    }

    const handleFilterFriends = (searchTerm) => 
        setIntermediateFriendsList(friendsList.filter( friend => friend.username.toLowerCase().includes(searchTerm.toLowerCase())));

    const addToGroup = (friendID) => {
        if(groupInfo.members.filter( members => members.id === friendID).length > 0)
            return
        
        const add = async() => {
            await addFriendToGroup(friendID, groupInfo.groupID).then(res=>console.log(res));
            await userMetadata().then(res=>{
                setGroupInfo(res.groups.filter(group => group.groupID === groupInfo.groupID)[0])
                setIntermediateFriendsList(intermediateFriendsList.filter(friend => friend.id !== friendID))
                setFriendsList(friendsList.filter(friend => friend.id !== friendID));
                ctx.setUserInfo(res);
                handleOpenSnackBar(friendID);
            })
        }
        add();
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
    }

    React.useEffect(()=>{
        const getPals = async() =>{
            await getFriends().then(res=>{
                //Prevents from re-adding friends multiple times
                const friends = res.filter(newFriend => !groupInfo.members.find(groupFriend => (groupFriend.id === newFriend.id) ))
                setFriendsList(friends)
            });
        }
        getPals();
    },[])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                paddingBottom: '100px',
            }}
        >
            <NMHeader />
            <Snackbar open={openSnackBar} anchorOrigin={{vertical:'top', horizontal:'center'}} autoHideDuration={5000} onClose={handleCloseSnackBar} message={snackbarMessage} />
            <h1>{groupInfo.groupName}</h1>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap:'wrap'}}>
                {groupInfo.members.map((member) => (
                    <Link to={member.id === ctx.userInfo.id ? `/user/${member.id}` : `/user/friend/${member.id}`}>
                        <Avatar
                            style={{ margin: '5px' }}
                            alt={member.username.toUpperCase()}
                            src={`/profileImages/${member.profileID}.jpg`}
                        />
                    </Link>
                ))}
            </div>
            
            <Button 
                onClick={()=> handleOpenFM() }
                variant="contained"
                style={{
                    width:'300px',
                    maxWidth: '300px',
                    backgroundColor: '#6C63FF',
                    borderRadius: '15px',
                    margin:'15px auto'
                }}
            >Add Friend(s) to Group</Button>

            <Modal
                open={openFriendModal}
                onClose={handleCloseFM}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{maxHeight:'800px', justifyContent:'center'}}>
                    <h2>Add Friend to Group</h2>
                    <TextField onChange={(e)=>handleFilterFriends(e.target.value)} fullWidth id="filled-basic" placeholder="Search Friend" variant="filled"/>
                    <div style={{display:'flex', flexDirection:'column', overflow:'scroll', padding:'5px'}}>
                        {intermediateFriendsList?.map(friend => 
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                {friend.profileImageID !== null ? 
                                    <img style={{maxWidth:'40px', borderRadius:'50%', margin:'15px'}} src={`/profileImages/${friend.profileImageID}.jpg`}/> 
                                    : 
                                    <img style={{maxWidth:'40px', borderRadius:'50%', margin:'15px'}} src={`https://eu.ui-avatars.com/api/?name=${friend.username}&size=250&length=1&background=bdbdbd&color=fff`}/>
                                }
                                <p>{friend.username}</p>
                                <AddCircle onClick={()=>addToGroup(friend.id)}/>
                            </div>
                        )}
                    </div>
                </Box>
            </Modal>

            <Box>
                <List>
                    {groupInfo.lists.map((list, listIdx) => (
                        <ListItem key={listIdx}>
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
                                    to={`/list/${list.listID}`}
                                    style={{
                                        margin: 'auto',
                                        textDecoration: 'none',
                                        color: 'black',
                                    }}
                                    state={{
                                        list: list,
                                        groupName: groupInfo.groupName,
                                        groupID: groupInfo.groupID,
                                        groupIdx: location.state.groupIdx,
                                        listIdx: listIdx,
                                    }}
                                >
                                    {list.listName}
                                </Link>
                                <AvatarGroup max={2}>
                                    {list.listMembers.map((member) => (
                                        <Avatar
                                            alt={member.username.toUpperCase()}
                                            src={`/profileImages/${member.profileID}.jpg`}
                                        />
                                    ))}
                                </AvatarGroup>
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Fab
                onClick={() => handleAddList()}
                color="primary"
                aria-label="add"
                style={{
                    position: 'fixed',
                    top: '80%',
                    left: '80%',
                    backgroundColor: '#6C63FF',
                }}
            >
                <AddIcon />
            </Fab>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Create New List?</h3>
                    <TextField
                        id="filled-basic"
                        label="List Name"
                        variant="filled"
                        onChange={handleInputChange}
                    />
                    <Button
                        onClick={() => handleCreateList()}
                        variant="contained"
                        style={{
                            maxWidth: '300px',
                            margin: 'auto',
                            backgroundColor: '#6C63FF',
                            borderRadius: '15px',
                            margin: '5%',
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
            <Footer />
        </div>
    )
}

export default Group
