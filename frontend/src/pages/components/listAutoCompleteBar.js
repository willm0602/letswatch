import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { Autocomplete, createTheme, TextField } from '@mui/material'
import { UserContext } from '../../contextSetup'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Modal from '@mui/material/Modal'
import Skeleton from '@mui/material/Skeleton'
import CircularProgress from '@mui/material/CircularProgress'

import { Link } from 'react-router-dom'

//API stuff
import { mediaSearch } from '../../APIInterface/MediaSearch'
import {addMediaToWatchlist, removeMediaFromWatchList} from '../../APIInterface/WatchList'
import { userMetadata } from '../../APIInterface/GetUserData'
import { allMedia } from '../../APIInterface/MediaSearch'


const ListAutoCompleteBar = () => {
    const ctx = useContext(UserContext);
    const autoFillMedia = ctx.autoFillMedia.filter(media => media.image_url && media.rating > 0);
    const [searchInputValue, setSearchInputValue] = useState('')
    const [listContent, setListContent] = useState([]);
    const location = useLocation();
    const groupIdx = location.state.groupIdx;
    const listIdx = location.state.listIdx;
    const [open, setOpen] = useState(false)
    const [newMediaFromSearch, setNewMediaFromSearch] = useState(null)

    const newHandleClick = (mediaID) => {
        //this return needs to be changed
        if (listContent.filter((media) => media.id === mediaID) > 0) return

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

    const handlePageTransition = (mediaInfo) => mediaInfo.tmdb_id ? ctx.setCurrentMediaPage({...mediaInfo, id:mediaInfo.tmdb_id}) : ctx.setCurrentMediaPage({...mediaInfo, id:mediaInfo.tmdbID});

    const handleMediaNotFound = () => {
        handleOpen()
        const searchMedia = async (search) =>
            await mediaSearch(search).then((res) => setNewMediaFromSearch(res))
        searchMedia(searchInputValue)
    }

    const handleOpen = () => setOpen(true)
    const handleClose = () => {
        setOpen(false)
        setNewMediaFromSearch(null)
        setSearchInputValue('')
    }

    return(
        <>
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
                        <Link to={`/media/${options.tmdb_id}`} onClick={()=>handlePageTransition(options)}>
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
    </>
)}

export default ListAutoCompleteBar;