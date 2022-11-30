import { Fragment, useContext, useState, useEffect } from 'react'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Modal from '@mui/material/Modal'
import { Box } from '@mui/system'
import { UserContext } from '../contextSetup'
import {FormControl, InputLabel, TextField} from '@mui/material'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'

import SearchIcon from '@mui/icons-material/Search'
import { userMetadata } from '../APIInterface/GetUserData'
import { Grid } from '@mui/material'
import ProfileImage from './components/ProfileImage'
import { Link } from 'react-router-dom'
import {Select, MenuItem} from '@mui/material'
import { makeWatchList } from '../APIInterface/WatchList'

const Watchlist = ({ watchlistData }) => {

    
    return (
        <Link
        state={{
            list: watchlistData,
            groupName: watchlistData.groupName,
            groupID: watchlistData.groupID,
            groupIdx: watchlistData.groupIdx,
            listIdx: watchlistData.listIdx,
        }}
        style={{
            width: '120px',
            height: '80px',
            borderStyle: 'solid',
            cursor: 'pointer',
                borderRadius: '5px',
                marginLeft: 6,
                marginRight: 6,
                marginBottom: 25,
                position: 'relative',
            }}
            to={`/list/${watchlistData.listID}`}
            >
            <h2
                style={{
                    fontSize:
                    watchlistData.listName.length < 15 ? '2vh' : '1.5vh',
                    paddingTop: 0,
                    margin: 0,
                    textAlign: 'center',
                }}
                >
                {watchlistData.listName}
            </h2>
            <h3
                style={{
                    fontSize: 12,
                    marginTop: 0,
                    width: '100%',
                    textAlign: 'center',
                }}
                >
                {watchlistData.groupName}
            </h3>
            <div
                style={{
                    position: 'absolute',
                    bottom: '16px',
                    width: '100%',
                    height: 'fit-content',
                }}
                >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        position: 'relative',
                        justifyContent: 'center',
                    }}
                    >
                    {watchlistData.listMembers.map((member, idx) => {
                        return (
                            <ProfileImage
                            profileID={member.profileID}
                            username={member.username}
                            otherStyles={{
                                position: 'absolute',
                                alignSelf: 'center',
                                zIndex: `${-1 * idx}`,
                                marginRight: `-${24 * idx}px`,
                            }}
                            />
                            )
                        })}
                </div>
            </div>
        </Link>
    )
}

const Lists = () => {
    const [watchLists, setWatchlists] = useState([])
    const [userGroups, setUserGroups] = useState([]);
    const [currentSearch, setCurrentSearch] = useState('')
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [modalSelectedGroup, setModalSelectedGroup] = useState(undefined);

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: '#fff',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
    }

    const updateLists = () => {
        userMetadata().then((data) => {
            const groups = data.groups
            let newListOfLists = []
            for (const group in groups) {
                for (const list in groups[group].lists) {
                    newListOfLists.push(
                        { 
                            ...groups[group].lists[list],
                            groupName: groups[group].groupName, 
                            groupID: groups[group].groupID, 
                            groupIdx:group, 
                            listIdx:list 
                        }
                    )
                }
            }
            setWatchlists(newListOfLists)
            setUserGroups(groups);
            console.log('new groups list is', userGroups);
        })
    }

    useEffect(() => {
        updateLists();
    }, [])

    return (
        <>
            <NMHeader />
            <h1
                style={{
                    fontSize: 24,
                    textDecoration: 'underline',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                Lists
            </h1>

            <div
                style={{
                    position: 'relative',
                    width: '50vw',
                    marginLeft: '25vw',
                    marginTop: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyItems: 'center',
                }}
            >
                <input
                    type="text"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        borderRadius: '25px',
                        height: 28,
                        padding: '4px 0 0 16px',
                    }}
                    onChange={(e) => {
                        const query = e.target.value;
                        setCurrentSearch(query);
                    }}
                />
                <SearchIcon
                    style={{
                        position: 'absolute',
                        right: 0,
                    }}
                />
            </div>

            <Grid
                container
                style={{
                    paddingBottom:'80px'
                }}
                sx={{
                    columnCount: 3,
                    marginTop: '4vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignSelf: 'center',
                }}
            >
                {watchLists
                    .filter((watchList) => {
                        return watchList.listName.toLowerCase().includes(currentSearch.toLowerCase())
                    })
                    .map((list) => {
                        return <Watchlist watchlistData={list} />
                    })}
            </Grid>
            
            <Fab
                onClick={() => setModalIsOpen(true)}
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
                open={modalIsOpen}
                onClose={(e) => {setModalIsOpen(false)}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <h3>Add new item to list?</h3>
                    <TextField
                        id="select-group"
                        value={modalSelectedGroup ? modalSelectedGroup.groupName : undefined}
                        select
                        onChange={(e) => {
                            setModalSelectedGroup(e.target.value);
                            console.log(modalSelectedGroup);
                        }}
                        label='Select Group'
                        fullWidth
                        >
                        {userGroups.map((group) => {
                            return <MenuItem value={group} key={`group-${group.id}`}
                            >
                                {group.groupName}
                            </MenuItem>
                        })}
                    </TextField>
                    <TextField
                        id="filled-basic"
                        label="Group Name"
                        variant="filled"
                        value={newListName}
                        onChange={(e) => {
                            setNewListName(e.target.value);
                        }}
                    />
                    <Fab
                        onClick={() => {
                            if(newListName && modalSelectedGroup)
                            {
                                makeWatchList(newListName, modalSelectedGroup.groupID).then(
                                    (resp) => {
                                        setModalIsOpen(false);
                                        updateLists();
                                    }
                                ).catch(
                                    (err) => {
                                        console.error(err);
                                        setModalIsOpen(false);
                                    }
                                )
                            }
                        }}
                        color="primary"
                        aria-label="add"
                        style={{
                            marginTop: '15%',
                            left: '80%',
                            backgroundColor: '#6C63FF',
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Box>
            </Modal>

            <Footer />
        </>
    )
}

export default Lists
