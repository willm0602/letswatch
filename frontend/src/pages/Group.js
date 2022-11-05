import { Link, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Button from '@mui/material/Button'

import * as React from 'react';
import Modal from '@mui/material/Modal';

import { useContext } from 'react'
import { UserContext } from '../contextSetup'
import { TextField } from '@mui/material'

//API stuff
import { makeWatchList } from '../APIInterface/WatchList'
import { userMetadata } from '../APIInterface/GetUserData'

const Group = () => {
    const location = useLocation();
    const [groupInfo, setGroupInfo] = React.useState(location.state.group);
    const ctx = useContext(UserContext);

    const [open, setOpen] = React.useState(false);
    const [newListName, setNewListName] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewListName('');
    }

    const handleAddList = () => {
        handleOpen()
    }

    const handleInputChange = (event) => {
        setNewListName(event.target.value);
    }

    const handleCreateList = () => {
        let newLists = ctx.userInfo.groups[location.state.groupIdx].lists
        const newList = {
            listID:9,
            listMembers:[{username:ctx.userInfo.username, profileID:ctx.userInfo.profileID}],
            listName:newListName,
            media:[]
        }
        let newDBInfo = ctx.userInfo;
        newDBInfo.groups[location.state.groupIdx].lists = [...newDBInfo.groups[location.state.groupIdx].lists, newList];
        ctx.setUserInfo(newDBInfo);
        
        makeWatchList(newListName, ctx.userInfo.groups[location.state.groupIdx].groupID)
            .then(userMetadata()
                .then((res) => ctx.setUserInfo(res)))
                    .then(setGroupInfo(ctx.userInfo.groups[location.state.groupIdx]))
        handleClose();
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
        display:'flex',
        flexDirection:'column'
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                paddingBottom:'100px'
            }}
        >
            <NMHeader />
            <h1>{groupInfo.groupName}</h1>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {groupInfo.members.map((member) => (
                    <Avatar
                        style={{ margin: '5px' }}
                        alt={member.username}
                        src={`/profileImages/${member.profileID}.jpg`}
                    />
                ))}
            </div>

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
            
            <Fab onClick={()=>handleAddList()} color="primary" aria-label="add" style={{position:'fixed', top:'80%', left:'80%', backgroundColor:'#6C63FF'}}>
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
                    <TextField id="filled-basic" label="List Name" variant="filled" onChange={handleInputChange}/>
                    <Button
                        onClick={()=>handleCreateList()}
                        variant="contained"
                        style={{
                            maxWidth: '300px',
                            margin: 'auto',
                            backgroundColor: '#6C63FF',
                            borderRadius: '15px',
                            margin:'5%'
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
