import Footer from './components/footer'
import { UserContext } from '../contextSetup'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FrontPageMedia from './components/frontPageMedia'
import FrontPageActors from './components/frontPageActors'

//MUI
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import { Button } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import { Autocomplete } from '@mui/material'
import { TextField } from '@mui/material'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

//API
import getFromTMDB from '../APIInterface/TMDB'
import { mediaSearch } from '../APIInterface/MediaSearch'

const ManyMedia = () => {
    const ctx = useContext(UserContext);
    const autoFillMedia = ctx.autoFillMedia;

    const [randomBackground, setRandomBackground] = useState(0);
    const [popularMovies, setPopularMovies] = useState(null);
    const [popularTV, setPopularTV] = useState(null);
    const [trending, setTrending] = useState(null);
    const [popularActor, setPopularActor] = useState(null);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [newMediaFromSearch, setNewMediaFromSearch] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
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
        mediaInfo.tmdbID ? 
            ctx.setCurrentMediaPage({gather: true,type: mediaInfo.type,id: mediaInfo.tmdbID,}) 
            : 
            ctx.setCurrentMediaPage({gather: true,type: mediaInfo.type,id: mediaInfo.tmdb_id,})
    }

    const handleExtendedSearch = () => {
        handleOpen();
        const callBackend = async () => await mediaSearch(searchInputValue).then(res => setNewMediaFromSearch(res));
        callBackend()

    }

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 21)
        setRandomBackground(randomNumber)
        const setup = async() => {
            await getFromTMDB('/movie/popular?language=en-US&page=1').then((res)=> {console.log(res); setPopularMovies(res.results)});
            await getFromTMDB('/tv/popular?language=en-US&page=1').then((res)=> {console.log(res); setPopularTV(res.results)});
            await getFromTMDB('/trending/all/day?').then((res)=> setTrending(res.results));
            await getFromTMDB('/trending/all/day?').then((res)=> setTrending(res.results));
            await getFromTMDB('/person/popular?language=en-US&page=1').then((res)=> setPopularActor(res.results));
        }
        setup()
    }, [])

    return (
        <div style={{ paddingBottom: '100px' }}>
            <div
                style={{
                    backgroundImage: `url(/mediaBackgroundImages/${randomBackground}.jpg)`,
                    height: '250px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    boxShadow: '0px 1px 5px black',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(108,99,255,0.7)',
                        height: '100%',
                        width: '100%',
                    }}
                ></div>
                <h1 style={{ color: 'white', zIndex: '99' }}>Let's Watch</h1>
                <Autocomplete
                    id="autocomplete"
                    freeSolo={true}
                    inputValue={searchInputValue}
                    onInputChange={(event, value) => setSearchInputValue(value)}
                    options={autoFillMedia}
                    getOptionLabel={(option) => option.title}
                    sx={{
                        width: 300,
                        marginTop: '15px',
                        backgroundColor: 'white',
                        zIndex: 99,
                        borderRadius: '100px',
                    }}
                    renderOption={(props, options) => (
                        <Button
                            onClick={() => console.log(options)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '10px',
                                width: '100%',
                                textTransform: 'none',
                            }}
                        >
                            {' '}
                            {options.image_url ? (
                                <img
                                    style={{ maxWidth: '50px' }}
                                    src={options.image_url}
                                />
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
                            <Link
                                onClick={() => handlePageTransition(options)}
                                state={{
                                    gather: true,
                                    type: options.type,
                                    id: options.tmdb_id,
                                }}
                                to={`/media/${options.type}/${options.tmdb_id}`}
                                style={{ color: '#1976d2' }}
                            >
                                <ArrowCircleRightIcon />
                            </Link>
                        </Button>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Media"
                            inputProps={{
                                ...params.inputProps,
                                autocomplete: 'new-password',
                            }}
                        />
                    )}
                />
                <Button variant="contained" style={{margin:'5px', backgroundColor:'#6C63FF'}} onClick={()=>handleExtendedSearch()}>
                    Search
                </Button>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', margin:'15px'}}>
                
                {trending && popularMovies && popularTV && popularActor ?
                    <>
                        <h3>Trending</h3>                        
                        <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                            {trending.map( trendingMedia => <FrontPageMedia mediaInfo={trendingMedia} />)}
                        </div>

                        <h3>Popular Movies</h3>                        
                        <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                            {popularMovies.map( movie => <FrontPageMedia mediaInfo={movie} />)}
                        </div>

                        <h3>Popular TV</h3>                        
                        <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                            {popularTV.map( tv => <FrontPageMedia mediaInfo={tv} />)}
                        </div>

                        <h3>Popular Actors</h3>                        
                        <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                            {popularActor.map( actor => <FrontPageActors actorInfo={actor}/>)}
                        </div>
                    </>
                    :
                    <CircularProgress style={{color:'#6C63FF', width:'75px', height:'75px', display:'flex', margin:'auto', alignItems:'center', height:'500px'}}/>
                }
                
            </div>

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

                    {newMediaFromSearch ? newMediaFromSearch.map(newMedia => 
                        <Button
                            onClick={() => console.log(newMedia)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '10px',
                                width: '100%',
                                textTransform: 'none',
                            }}
                        >
                            {newMedia.image ? (
                                <img
                                    style={{ maxWidth: '50px' }}
                                    src={newMedia.image}
                                />
                            ) : (
                                <Skeleton
                                    animation={false}
                                    variant="rectangular"
                                    width={50}
                                    height={75}
                                />
                            )}
                            <p style={{ marginLeft: '15px' }}>
                                {newMedia.title}
                            </p>
                            <Link
                                onClick={() => handlePageTransition(newMedia)}
                                state={{
                                    gather: true,
                                    type: newMedia.type,
                                    id: newMedia.tmdbID,
                                }}
                                to={`media/${newMedia.id}`}
                                style={{ color: '#1976d2' }}
                            >
                                <ArrowCircleRightIcon />
                            </Link>
                        </Button>    
                        
                        )
                        : 
                        (
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                        )
                    }
                </Box>
            </Modal>

            <Footer />
        </div>
    )
}

export default ManyMedia
