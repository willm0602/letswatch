import React, { useState, useContext, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Autocomplete, createTheme, TextField } from '@mui/material'
import { UserContext } from '../contextSetup'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Modal from '@mui/material/Modal'
import Skeleton from '@mui/material/Skeleton'
import CircularProgress from '@mui/material/CircularProgress'
import Footer from './components/footer'
import NMHeader from './components/nonMediaHeader'
import { Link } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar';

//API stuff
import { mediaSearch } from '../APIInterface/MediaSearch';
import {addMediaToWatchlist, removeMediaFromWatchList} from '../APIInterface/WatchList';
import { userMetadata } from '../APIInterface/GetUserData';
import { allMedia } from '../APIInterface/MediaSearch';
import { joinList } from '../APIInterface/WatchList';

const ListOfMedia = () => {
    //used for displaying the content as updating content doesn't update the DOM.
    const [listContent, setListContent] = useState([]);
    const [listInfo, setListInfo] = useState();
    const [autoFillMedia, setAutoFillMedia] = useState();
    const ctx = useContext(UserContext);
    const location = useLocation();
    const groupIdx = location.state.groupIdx;
    const listIdx = location.state.listIdx;
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleOpenSnackbarNotMember = () => {
        setSnackbarMessage("Sorry, you can only make changes to lists if you are a member :/");
        setOpenSnackBar(true);
    }

    const handleOpenSnackbarAddMedia = (mediaName, listName) => {
        setSnackbarMessage(`Successfully added ${mediaName} to ${listName}!`);
        setOpenSnackBar(true);
    }

    const handleCloseSnackBar = () => setOpenSnackBar(false)

    useEffect(()=>{
        const setup = async() =>{
            await userMetadata()
                .then(res=>{
                    setListInfo(res.groups[groupIdx].lists[listIdx]);
                    setListContent([...res.groups[groupIdx].lists[listIdx].media])
                });
            await allMedia().then(res => setAutoFillMedia(res.filter(media => media.image_url && media.rating > 0)));
        }
        setup()
    },[])

    //search bar stuff
    const [searchInputValue, setSearchInputValue] = useState('')
    //modal
    const [open, setOpen] = useState(false)
    const [newMediaFromSearch, setNewMediaFromSearch] = useState(null)
    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setNewMediaFromSearch(null)
        setSearchInputValue('')
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    }

    const handlePageTransition = (mediaInfo) => {
        mediaInfo.tmdb_id ? ctx.setCurrentMediaPage({...mediaInfo, id:mediaInfo.tmdb_id}) : ctx.setCurrentMediaPage({...mediaInfo, id:mediaInfo.tmdbID})
    };

    const handleMediaNotFound = () => {
        handleOpen()
        const searchMedia = async (search) => await mediaSearch(search).then((res) => setNewMediaFromSearch(res))
        searchMedia(searchInputValue)
    }

    const addMediaFromNotFoundSearch = (mediaIdx) => {
        let mediaToAdd = newMediaFromSearch[mediaIdx]
        mediaToAdd = {
            ...mediaToAdd,
            image_url: mediaToAdd.image,
        }
        //prevent duplicates
        if (listContent.filter((media) => media.id === mediaToAdd.id).length > 0) return;

        setListContent([...listContent, mediaToAdd])
        const newMedia = [
            ...ctx.userInfo.groups[groupIdx].lists[listIdx].media.slice(),
            mediaToAdd,
        ]
        ctx.userInfo.groups[groupIdx].lists[listIdx].media = newMedia
        const createNewListItem = async (mediaID) => {

            const listID = ctx.userInfo.groups[groupIdx].lists[listIdx].listID
            await addMediaToWatchlist(listID, mediaID).then((res) =>
                userMetadata().then((res) => {
                    ctx.setUserInfo(res)
                    setListContent([
                        ...res.groups[groupIdx].lists[listIdx].media,
                    ])
                    allMedia().then((res) => ctx.setAutoFillMedia(res))
                    setNewMediaFromSearch(newMediaFromSearch.filter(media => media.id !== mediaID))
                    handleOpenSnackbarAddMedia(mediaToAdd.title, ctx.userInfo.groups[groupIdx].lists[listIdx].listName)
                })
            )
        }
        createNewListItem(mediaToAdd.id)
        userMetadata().then((res) => console.log('no-op')) //no op
    }

    const newHandleClick = (mediaID) => {
        //this return needs to be changed
        if(listInfo.listMembers.filter( member => member.username === ctx.userInfo.username).length === 0){
            handleOpenSnackbarNotMember();
            return
        };

        if (listContent.filter((media) => media.id === mediaID).length > 0) return;

        const creatNewListItem = async () => {
            const listID = ctx.userInfo.groups[groupIdx].lists[listIdx].listID
            await addMediaToWatchlist(listID, mediaID).then((res) =>
                userMetadata().then((res) => {
                    ctx.setUserInfo(res)
                    setListContent([
                        ...res.groups[groupIdx].lists[listIdx].media,
                    ])
                    allMedia().then((res) => ctx.setAutoFillMedia(res))
                })
            )
        }
        creatNewListItem()
        userMetadata().then((res) => console.log('no-op')) //no op
    }

    const handleRemove = (mediaIDtoRemove) => {
        
        if(listInfo.listMembers.filter( member => member.username === ctx.userInfo.username).length === 0){
            handleOpenSnackbarNotMember();
            return
        };

        const newMedia = [...ctx.userInfo.groups[groupIdx].lists[listIdx].media.filter(media => media.id !== mediaIDtoRemove)];
        ctx.userInfo.groups[groupIdx].lists[listIdx].media = newMedia;
        setListContent(newMedia);
        //update db
        const removeItem = async() => {
            const listID = ctx.userInfo.groups[groupIdx].lists[listIdx].listID;
            await removeMediaFromWatchList(listID, mediaIDtoRemove);
        }
        removeItem()
        userMetadata().then((res) => console.log('no-op'));//no op
    }

    const handleJoinList = () => {
        if(listInfo.listMembers.filter(member => member.username === ctx.userInfo.username).length > 0)
            return; //prevent double adds

        const join = async() =>
            await joinList(listInfo.listID).then(_ => 
                userMetadata().then(res => 
                    setListInfo(res.groups[groupIdx].lists[listIdx])));
        join();
    }

    return (
        listInfo ?
        <>
            <NMHeader />
            <Snackbar open={openSnackBar} anchorOrigin={{vertical:'top', horizontal:'center'}} autoHideDuration={5000} onClose={handleCloseSnackBar} message={snackbarMessage} />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '5%',
                    paddingBottom: '100px',
                }}
            >
                <h1>{listInfo.listName}</h1>
                <h2>List members:</h2>
                <Stack direction="row">
                    {listInfo.listMembers.map((member,index) => (
                        <Link key={index} to = {member.id === ctx.userInfo.id ? `/user/${member.id}`:`/user/friend/${member.id}`}>
                            <Avatar
                                style={{
                                    margin: '15px 5px',
                                    border: '1px solid black',
                                }}
                                alt={member.username.toUpperCase()}
                                src={`/profileImages/${member.profileID}.jpg`}
                            />
                        </Link>
                    ))}
                </Stack>
                
                <Button
                    onClick={()=>handleJoinList()}
                    variant="contained"
                    style={{
                        maxWidth: '300px',
                        margin:'15px',
                        backgroundColor: '#6C63FF',
                        borderRadius: '15px',
                    }}
                >
                Join List</Button>

                <Autocomplete
                    id="add-media"
                    sx={{ width: '90%', border: '1px solid lightgrey' }}
                    freeSolo={true}
                    inputValue={searchInputValue}
                    onInputChange={(event, value) => setSearchInputValue(value)}
                    options={autoFillMedia}
                    getOptionLabel={(option) => option.title}
                    renderOption={(props, options) => (
                        <Button
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '10px',
                                width: '100%',
                                textTransform: 'none',
                            }}
                        >
                                {options.image_url ? (
                                    <Link to={`/media/${options.type}/${options.tmdb_id}`} onClick={()=>handlePageTransition(options)}>
                                    <img
                                        style={{ maxWidth: '50px' }}
                                        src={options.image_url}
                                    />
                                    </Link>
                                ) : (
                                    <Skeleton
                                        animation={false}
                                        variant="rectangular"
                                        width={50}
                                        height={75}
                                    />
                                )}
                                <p style={{ marginLeft: '15px' }}>
                                    {options.title}
                                </p>

                            <AddCircleIcon
                                onClick={() => {
                                    newHandleClick(options.id) //was handleClick
                                }}
                            />
                        </Button>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Add Media"
                            inputProps={{
                                ...params.inputProps,
                                autocomplete: 'new-password',
                            }}
                        />
                    )}
                ></Autocomplete>
                {searchInputValue !== '' ? (
                    <Button
                        onClick={() => handleMediaNotFound()}
                        style={{ margin: '5px' }}
                        variant="contained"
                    >
                        Media not found?
                    </Button>
                ) : null}

                <Box>
                    <List>
                        {listContent.map((mediaItem, mediaIndex) => (
                            <ListItem key={mediaIndex}>
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <Link to={`/media/${mediaItem.type}/${mediaItem.tmdbID}`} onClick={() => handlePageTransition(mediaItem)} >
                                        <div style={{ position: 'relative' }}>
                                            <img style={{maxWidth: '90px', margin: '15px'}} src={mediaItem.image} />
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                        width: '15px',
                                                        height: '15px',
                                                        borderRadius: '50%',
                                                        bottom: '5px',
                                                        left: '70%',
                                                        color: 'black',
                                                        backgroundColor:
                                                            mediaItem.rating > 70
                                                                ? '#66FF63'
                                                                : mediaItem.rating >
                                                                  50
                                                                ? '#FFF963'
                                                                : '#FFC165',
                                                        padding: '5px',
                                                        textAlign: 'start',
                                                        border: '1px solid black',
                                                    }}
                                                >
                                                    <span style={{fontSize: '0.75em',}}>
                                                        <b>{Math.round(mediaItem.rating)}</b>
                                                    </span>
                                                    <span style={{fontSize: '0.55em'}}>
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                            
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    handleRemove(
                                                        mediaItem.id
                                                    )
                                                }}
                                                style={{
                                                    backgroundColor: 'crimson',
                                                    color: 'white',
                                                    marginLeft: 'auto',
                                                    marginRight: 'auto',
                                                    padding: '0',
                                                }}
                                            >
                                                <CloseIcon />
                                            </Button>
                                        </div>

                                    <div>
                                        <p style={{ margin: '5px' }}>
                                            <b>{mediaItem.title}</b>, added by:{' '}
                                            <b>{mediaItem.addedBy}</b>
                                        </p>
                                        <div
                                            style={{
                                                maxHeight: '250px',
                                                padding: '5px',
                                                overflow: 'scroll',
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: '5px',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {mediaItem.synopsis}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={style}
                        style={{ overflow: 'scroll', maxHeight: '75%' }}
                    >
                        <h3>Extended Search</h3>
                        <p>
                            Search based off input: <b>{searchInputValue}</b>
                        </p>
                        {newMediaFromSearch ? (
                            newMediaFromSearch.map(
                                (newMedia, newMediaIndex) => (
                                    <div
                                        key={newMediaIndex}
                                        style={{
                                            display: 'flex',
                                            padding: '15px',
                                            justifyContent: 'space-evenly',
                                        }}
                                    >
                                        <Button
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                paddingTop: '10px',
                                                width: '100%',
                                                textTransform: 'none',
                                            }}
                                        >
                                            {' '}
                                            <Link to={`/media/${newMedia.type}/${newMedia.tmdbID}`} onClick={() => handlePageTransition(newMedia)}>
                                            <img
                                                style={{ maxWidth: '50px' }}
                                                src={newMedia.image}
                                            />
                                            </Link>
                                            <p style={{ marginLeft: '15px' }}>
                                                {newMedia.title}
                                            </p>
                                            <AddCircleIcon
                                                onClick={() => {
                                                    addMediaFromNotFoundSearch(
                                                        newMediaIndex
                                                    )
                                                }}
                                            />
                                        </Button>
                                    </div>
                                )
                            )
                        ) : (
                            <Box sx={{ display: 'flex' }}>
                                <CircularProgress />
                            </Box>
                        )}
                    </Box>
                </Modal>

                <Footer />
            </div>
        </>
        :
        <div style={{margin:'auto'}}>
            <CircularProgress style={{color:'#6C63FF', width:'100px', height:'100px', display:'flex', margin:'auto', alignItems:'center', height:'800px'}}/>
            <Footer/>
        </div>
    )
}
export default ListOfMedia
