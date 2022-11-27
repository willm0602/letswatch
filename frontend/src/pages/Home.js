import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contextSetup'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Link } from 'react-router-dom'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getFriends, sendFriendRequest, getAllFriendRequests, acceptFriendRequest, denyFriendRequest } from '../APIInterface/Friendships';
import { Modal } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';

/*
    TODO:
        [x] fix the thing above?
        [x] have extended media search add to the backend
        [x] play with media(plural) page and get it setup
        [x] media page needs to be setup for extended search
        [x] there's a bug with ID's and TV going from search to media page
        [x] groups page freaking out if you refresh, but different

        [x] Add friends section to home
        [x] friend modal
        [x] functionality for adding users as friends
        [x] add friend to group
        [x] add friends to list
        [x] single media, add media to list
        [x] talk to will about getting userInfo
        [x] fix inital image to display avatar word thing
        [] maybe add search above friends
        [x] remove lists on add to list when the list exists on that list
        [] add snackbar for feedback
        [x] add follow through to single media page from extended search on list page
        [] friend profiles
*/

const Home = () => {   
    const ctx = useContext(UserContext)
    console.log(ctx)
    const [userFriends, setUserFriends] = useState(null);
    const [currentFriendUsername, setCurrentFriendUesrname] = useState(null);
    const [friendRequests, setFriendRequets] = useState(null); 
    const [openFriendRequestModal, setOpenFriendRequestModal] = useState(false);
    const handleCloseFriendRequestModal = () => setOpenFriendRequestModal(false);
    const handleOpenFriendRequestModal = () => setOpenFriendRequestModal(true);
    const [modalOpen, setModalOpen] = useState(false);
    const handleCloseModal = () => setModalOpen(false);
    const handleOpenModal = () => setModalOpen(true);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleOpenSnackBarSuccessfulFR = () => {
        setSnackbarMessage('Friend Request Sent!');
        setOpenSnackBar(true);
    }

    const handleOpenSnackBarAlreadyFriend = () => {
        setSnackbarMessage('Sorry, That user is already your friend :/');
        setOpenSnackBar(true);
    }

    const handleOpenSnackBarAddYourself = () => {
        setSnackbarMessage("Sorry, can't add yourself :/");
        setOpenSnackBar(true);
    }

    const handleOpenSnackBarDenyRequest = () => {
        setSnackbarMessage("Request successfully removed");
        setOpenSnackBar(true);
    }


    const handleCloseSnackBar = () => setOpenSnackBar(false);

    const handleAddFriend = () => {
        console.log(currentFriendUsername);

        if(currentFriendUsername === ctx.userInfo.username){
            handleOpenSnackBarAddYourself()
            return;
        }

        if(userFriends.filter(friend => friend.username === currentFriendUsername).length > 0){
            handleOpenSnackBarAlreadyFriend();
            return;
        }

        const sendRequest = async() => {
            await sendFriendRequest(currentFriendUsername)
                .catch(err => console.log(err))
                .then(res => {
                    handleOpenSnackBarSuccessfulFR()
                    handleCloseModal();
                })
        }
        console.log(currentFriendUsername);
        sendRequest();
    }

    const handleApproveFriendRequest = (requestID) => {
        acceptFriendRequest(requestID);
        console.log(`approve request for id: ${requestID}`);
        setFriendRequets(friendRequests.filter(friend => friend.id !== requestID))
        
        const updateRequests = async() => {
            await getFriends().then(res => setUserFriends(res));
        }
        updateRequests();
    }

    const handleDenyFriendRequest = (requestUsername) => {
        console.log(`deny request for id: ${requestUsername}`);

        
        const updateFriends = async() => {
            await denyFriendRequest(requestUsername).then( _ =>
                getAllFriendRequests().then(res=>setFriendRequets(res))
            )
        }
        updateFriends();
        handleOpenSnackBarDenyRequest();
    }

    useEffect(()=>{
        const setup = async() =>{
            await getFriends().then(res=>setUserFriends(res));
            await getAllFriendRequests().then(res=>setFriendRequets(res));
        }
        setup();
    },[])

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return ctx.userInfo ? (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                marginBottom: '100px',
            }}
        >
            <NMHeader />
            <Snackbar open={openSnackBar} anchorOrigin={{vertical:'top', horizontal:'center'}} autoHideDuration={5000} onClose={handleCloseSnackBar} message={snackbarMessage} />
            {friendRequests && friendRequests.length > 0 ?
                <>
                    <Paper onClick={()=>handleOpenFriendRequestModal()} elevation={3} style={{display:'flex', justifyContent:'center', color:'white', backgroundColor:'rgba(108,99,255)', padding:'15px', margin:'10px', borderRadius:'15px'}}>
                        <AddIcon /> New Friend Request(s)
                    </Paper>
                    <Modal
                        open={openFriendRequestModal}
                        onClose={handleCloseFriendRequestModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <h3>Friend Requests</h3>
                            {friendRequests.map((request, requestIndex) => 
                                <Paper key={requestIndex} elevation={3} style={{display:'flex', margin:'15px', justifyContent:'space-evenly', alignItems:'center', border:'1px solid grey', padding:'5px', borderRadius:'15px'}}>
                                    {request.ProfileImageID !== null ? 
                                        <img style={{maxWidth:'40px', borderRadius:'50%'}} src={`/profileImages/${request.ProfileImageID}.jpg`}/>
                                        :
                                        <img style={{maxWidth:'40px', borderRadius:'50%', margin:'15px'}} src={`https://eu.ui-avatars.com/api/?name=${request.Username}&size=250&length=1&background=bdbdbd&color=fff`}/>
                                    }
                                    <p>{request.Username}</p>
                                    <CheckCircleIcon onClick={()=>handleApproveFriendRequest(request.id)} style={{color:'#84ff38', width:'30px', height:'30px'}}/>
                                    <CancelIcon onClick={()=>handleDenyFriendRequest(request.Username)} style={{color:'#ff4538', width:'30px', height:'30px'}}/>
                                </Paper>
                            )}
                        </Box>
                    </Modal>
                </>
            : null}

            <img
                style={{ maxWidth: '200px', margin: 'auto', marginTop: '2em' }}
                src="/undraw1.svg"
            />

            <h2>Groups</h2>
            <Box style={{ margin: 'auto' }}>
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
            <Link to="/groups" style={{ textDecoration: 'none' }}>
                <Button
                    variant="contained"
                    style={{
                        maxWidth: '300px',
                        margin: 'auto',
                        backgroundColor: '#6C63FF',
                        borderRadius: '15px',
                    }}
                >
                    See More
                </Button>
            </Link>

            <h2>Friends</h2>
            {userFriends && userFriends.length > 0 ?
                <div className='frame' style={{display:'flex', justifyContent:'start', padding:'15px', overflow:'scroll', marginBottom:'25px', marginRight:'10px', marginLeft:'10px'}}>
                        {userFriends.map((friend, friendIndex) => 
                            <Link key={friendIndex} to={`/user/friend/${friend.id}`} style={{textDecoration:'none'}}>
                                <div style={{display:'flex', flexDirection:'column'}}>
                                    {friend.profileImageID !== null ? 
                                        <img style={{maxWidth:'80px', borderRadius:'50%', margin:'15px'}} src={`/profileImages/${friend.profileImageID}.jpg`}/> 
                                        : 
                                        <img style={{maxWidth:'80px', borderRadius:'50%', margin:'15px'}} src={`https://eu.ui-avatars.com/api/?name=${friend.username}&size=250&length=1&background=bdbdbd&color=fff`}/>
                                    }
                                    <p style={{color:'black'}}>{friend.username}</p>
                                </div>
                            </Link>
                        )}
                </div>
            : 
            <p>Yikes, no friends? Cringe!</p>}
            <Button
                onClick={()=>handleOpenModal()}
                variant="contained"
                style={{
                    maxWidth: '300px',
                    margin: 'auto',
                    backgroundColor: '#6C63FF',
                    borderRadius: '15px',
                }}
            >
                Add Friend
            </Button>

            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h3>Add Friend By Username</h3>
                    <TextField onChange={(e)=>{setCurrentFriendUesrname(e.target.value)}} fullWidth id="filled-basic" placeholder="Friend's Username" variant="filled"/>
                    <Button
                        onClick={()=> handleAddFriend()}
                        variant="contained"
                        style={{
                            width:'300px',
                            maxWidth: '300px',
                            backgroundColor: '#6C63FF',
                            borderRadius: '15px',
                            margin:'15px auto'
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>

            <Footer />
        </div>
    ) : null
}

export default Home
