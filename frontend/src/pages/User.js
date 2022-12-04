import { useEffect, useState} from 'react'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { Link } from 'react-router-dom'
import { Box, List, ListItem, Paper, AvatarGroup, Avatar, Button, Stack, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, FormControl, Grid,} from '@mui/material'
import { deleteAccessToken } from '../LocalStorageInterface'
import { padding } from '@mui/system'
import { userMetadata } from '../APIInterface/GetUserData'
import { changeBio, changeImage } from '../APIInterface/UserProfileEdits'


const User = () => {
    const [bio, setBio] = useState('');
    const [modolHelperText, setModolHelperText] = useState(`Character Length: 0/100`);
    const [modolSubmit, setModolSubmit] = useState(true);
    const [userInfo,setUserInfo] = useState(null);
    const [modolOpen, setModolOpen] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [imageModolOpen, setImageModolOpen] = useState(false);
    const imageArray = [...Array(20).keys()];
    const [imageChoice, setImageChoice] = useState([]);

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
            await changeBio(bio)
                .then(
                    () => { console.log('Update Complete')},
                    () => { alert("Hmm, looks like the bio could't be changed. \nPlease try again");}
                )
        }
        submitBioRequest();
        handleModolClick();
    }

    const handleClick = (event) => {
        if(!imageModolOpen){
            setImageChoice([userInfo.profileID]);
        }
        setImageModolOpen(!imageModolOpen);
    }

    const handleImageChoiceClick = (iSrc) => {
        const last = iSrc.lastIndexOf('/');
        const ext = iSrc.indexOf('.jpg');
        const newImage = Number(iSrc.substring((last + 1),ext));
        setImageChoice([newImage]);
    }

    const submitImageChoice = () => {
        const newImage = imageChoice[0];
        const submitImageChoiceRequest = async() => {
            await changeImage(newImage)
                .then(
                    () => { console.log('Update Complete')},
                    () => { alert("Hmm, looks like image couldn't be changed.\nPlease try again");}
                )
        }
        submitImageChoiceRequest();
        handleClick();
    }

    useEffect(()=>{
        const setup = async() =>{
            await userMetadata().then(res=> {
                setUserInfo(res);
                let groupPosition = 0;
                let holdList=[];
                res.groups.map((groups) =>  {
                    let listPosition = 0;
                    groups.lists.map(list => {
                        list.groupID = groups.groupID;
                        list.groupName = groups.groupName;
                        list.groupIdx = groupPosition;
                        list.listIdx = listPosition;
                        holdList=([...holdList, list])
                        listPosition += 1;
                        }
                    )
                    groupPosition += 1;
                })
                setUserLists(holdList.slice(0,5));
            });
        }
        setup()
    },[userInfo])

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
                        Edit Bio
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
                <div style={{ margin: '0% 5% 5%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        {userInfo.profileID !== null ? 
                        <img
                            style={{ maxWidth: '100px', borderRadius: '50%' }}
                            src={`/profileImages/${userInfo.profileID}.jpg`}
                            alt={`${userInfo.profileID}.jpg`}
                            onClick = {(event) => handleClick(event)}
                        />
                        :
                        <img 
                            style={{
                                maxWidth:'100px', 
                                borderRadius:'50%'
                            }} 
                            src={`https://eu.ui-avatars.com/api/?name=${userInfo.username}&size=250&length=1&background=bdbdbd&color=fff`}
                            alt={`basicAvatar.jpg`}
                            />
                        }
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
                        <Grid
                            container
                            direction = "column"
                            justifyContent="center"
                            alignItems = "center"
                        >
                            {(imageChoice[0] === userInfo.profileID) &&
                                <>
                                    <h4>Current Profile Image</h4>
                                    <img
                                        style={{ 
                                            maxWidth: '100px', 
                                            borderRadius: '50%', 
                                            marginTop: "0px"
                                        }}
                                        src={`/profileImages/${userInfo.profileID}.jpg`}
                                        alt={`${userInfo.profileID}.jpg`}
                                    />
                                </>
                            }
                            {(imageChoice[0] !== userInfo.profileID) &&
                                <>
                                    <h4>New Profile Image Choice</h4>
                                    <img
                                        style={{ 
                                            maxWidth: '100px', 
                                            borderRadius: '50%', 
                                            marginTop: "0px"
                                        }}
                                        src={`/profileImages/${imageChoice[0]}.jpg`}
                                        alt={`${imageChoice[0]}.jpg`}
                                    />
                                </>
                            }
                            <h4>Profile Image Choices</h4>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <Stack
                            direction = "column"
                            alignItems = "center"
                            spacing = {2}
                        >
                            <Grid
                                container
                                direction = "row"
                                alignItems = "center"
                                justifyContent = "center"
                            >
                                {imageArray.map((index) => (
                                    <Grid
                                        item
                                        alignItems = "center"
                                        justifyContent = "center"
                                        sx = {{padding: "8px"}}
                                    >
                                        <img
                                            style = {{maxWidth: '100px', borderRadius: '50%'}}
                                            src={`/profileImages/${index}.jpg`}
                                            alt = {`${index}.jpg`}
                                            onClick = {(event) => handleImageChoiceClick(event.target.src)}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClick}
                        >
                            Cancel
                        </Button>
                        {(imageChoice[0] === userInfo.profileID) &&
                        <Button
                            disabled
                        >
                            Submit
                        </Button>}
                        {(imageChoice[0] !== userInfo.profileID) &&
                        <Button
                            onClick={submitImageChoice}
                        >
                            Submit
                        </Button>}
                    </DialogActions>
                </Dialog>
                <hr />
                <div style={{margin: '0 5%',}}>
                    <h1 style={{textAlign:'center' }}>Lists</h1>
                    <Box style = {{ margin: 'auto', padding}}>
                        <List>
                            {userLists.length === 0 ? (
                                <p style={{ textAlign: 'center'}}> No lists yet</p>
                            ) : (
                                <Box style={{ margin: 'auto'}}>
                                    <List>
                                        {userLists.map((list,index) => 
                                            (<ListItem key={index}>
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
                                                        state = {{
                                                            list: list,
                                                            groupName: list.groupName,
                                                            groupID: list.groupID,
                                                            groupIdx: list.groupIdx,
                                                            listIdx: list.listIdx
                                                        }}
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
                                                                alt={member.username.toUpperCase()}
                                                                src={`/profileImages/${member.profileID}.jpg`}
                                                            />
                                                        ))}
                                                    </AvatarGroup>
                                                </Paper>
                                            </ListItem>) 
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
                </div>
            </div>
            <Footer />
        </>
        :
        <CircularProgress style={{color:'#6C63FF', width:'100px', height:'100px', display:'flex', margin:'auto', alignItems:'center', height:'800px'}}/>
    )
}

export default User
