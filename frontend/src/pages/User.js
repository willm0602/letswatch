import { useEffect, useState} from 'react'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { Box, List, ListItem, Paper, Link, AvatarGroup, Avatar, Button, Stack, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, FormControl, Grid } from '@mui/material'
import { deleteAccessToken } from '../LocalStorageInterface'
import { padding } from '@mui/system'
import { userMetadata } from '../APIInterface/GetUserData'
import { changeBio } from '../APIInterface/UserProfileEdits'


const User = () => {
    const [bio, setBio] = useState('');
    const [modolHelperText, setModolHelperText] = useState(`Character Length: 0/100`);
    const [modolSubmit, setModolSubmit] = useState(true);
    const [userInfo,setUserInfo] = useState(null);
    const [modolOpen, setModolOpen] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [imageModolOpen, setImageModolOpen] = useState(false);
    const imageArray = [...Array(20).keys()]

    const handleClick = (event) => {
        setImageModolOpen(!imageModolOpen);
    }

    const handleModolClick = () => {
        setModolOpen(!modolOpen);
        setBio('');
        setModolHelperText(`Character Length: 0/100`);
    };
    
    const handleBio = (ev) => {
        setModolHelperText(`Character Length: ${ev.length}/100`)
        if ((ev).length <= 100) 
        {
            if(!modolSubmit){
                setModolSubmit(!modolSubmit);
            }
            setBio(ev);
        } else if ((ev).length > 100) {
            setModolSubmit(false);
        }
    }

    const submitBio = () => {
        setBio(bio.replaceAll("'", "''"));
        const submitBioRequest = async() => {
            await changeBio(userInfo.id, bio)
                .catch(err => console.log(err))
                .then(res => console.log(res))
        }
        submitBioRequest();
        handleModolClick();
    }

    useEffect(()=>{
        const setup = async() =>{
            await userMetadata().then(res=> {
                setUserInfo(res);
                let holdList=[];
                res.groups.map(groups =>  groups.lists.map(list => holdList=([...holdList, list])))
                setUserLists(holdList.slice(0,5));
            });
        }
        setup()
    },[])

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
                    style={{padding:'15px'}}
                >
                    <Button
                        variant = "contained"
                        onClick={handleModolClick}
                        sx={{ backgroundColor: '#6C63FF' }}
                    >
                        Edit
                    </Button>
                    <Dialog
                        open = {modolOpen}
                        fullWidth = 'false'
                    >
                        <DialogTitle>
                            Change Bio
                        </DialogTitle>
                        <DialogContent>
                            <FormControl 
                                fullWidth
                            >
                                <TextField
                                    color='secondary'
                                    margin = 'dense'
                                    variant='standard'
                                    multiline
                                    maxRows = {3}
                                    onChange = {(e) => {handleBio(e.target.value)}}
                                    helperText = {modolHelperText}
                                />

                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleModolClick}
                            >
                                Cancel
                            </Button>
                            {modolSubmit && 
                            <Button
                                type = 'submit'
                                onClick={submitBio} 
                            >
                                Submit
                            </Button>}
                            {!modolSubmit && 
                            <Button
                                disabled
                            >
                                Submit
                            </Button>}
                        </DialogActions>
                    </Dialog>
                    <Button
                        onClick={(e) => {
                            deleteAccessToken()
                            window.location = '/'
                        }}
                        variant = "contained"
                        sx={{ backgroundColor: 'red' }}
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
                            onClick = {(event) => handleClick(event)}
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
                <Dialog
                    open = {imageModolOpen}
                    fullWidth = 'false'
                >
                    <DialogTitle>
                        Change Profile Image
                    </DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            direction = "column"
                            justifyContent="center"
                            alignItems = "center"
                        >

                            <h4>Current Profile Image</h4>
                            <img
                                style={{ maxWidth: '100px', borderRadius: '50%'}}
                                src={`/profileImages/${userInfo.profileID}.jpg`}
                            />
                        </Grid>
                        <Grid
                            //sx = {{overflowY: "scroll"}}
                            container
                            direction = "row"
                        >
                            <Grid
                                container
                                direction = "row"
                                aliigItems = "center"
                                justifyContent = "center"
                            >
                                {imageArray.map((index) => (
                                    <Grid
                                    >
                                        <img
                                            style = {{maxWidth: '100px', borderRadius: '50%'}}
                                            src={`/profileImages/${index}.jpg`}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
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
                                <p style={{ textAlign: 'center'}}> No lists yet</p>
                            ) : (
                                <Box style={{ margin: 'auto'}}>
                                    <List>
                                        {userLists.map((list,index) => 
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
                                                        to={`/group/${list.listID}`}
                                                        style={{
                                                            margin: 'auto',
                                                            textDecoration: 'none',
                                                            color: 'black',
                                                        }}
                                                    >
                                                        {list.listName}
                                                    </Link>
                                                    <AvatarGroup max={2}>
                                                        {list.listMembers.map((member) => (
                                                            <Avatar
                                                                alt={member.username}
                                                                src={`/profileImages/${member.profileID}.jpg`}
                                                            />
                                                        ))}
                                                    </AvatarGroup>
                                                </Paper>
                                            </ListItem> 
                                        )}
                                    </List>
                                </Box>

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
                            {userInfo.groups.map((group, index) => (
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
        <CircularProgress style={{color:'#6C63FF', width:'100px', height:'100px', display:'flex', margin:'auto', alignItems:'center', height:'800px'}}/>
    )
}

export default User
