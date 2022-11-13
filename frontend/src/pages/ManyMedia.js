import Footer from './components/footer'
import { UserContext } from '../contextSetup'
import React, { useContext, useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import { TextField } from '@mui/material'
import { Link } from 'react-router-dom'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Button } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';

import getFromTMDB from '../APIInterface/TMDB';
import FrontPageMedia from './components/frontPageMedia'
import FrontPageActors from './components/frontPageActors'


const ManyMedia = () => {
    const ctx = useContext(UserContext)
    const autoFillMedia = ctx.autoFillMedia;

    const [randomBackground, setRandomBackground] = useState(0)
    const [popularMovies, setPopularMovies] = useState(null);
    const [popularTV, setPopularTV] = useState(null);
    const [trending, setTrending] = useState(null);
    const [popularActor, setPopularActor] = useState(null);
    
    const handlePageTransition = (mediaInfo) => {
        ctx.setCurrentMediaPage(
            {gather:true, type:mediaInfo.type, id:mediaInfo.tmdb_id}
        );
    }

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 21)
        setRandomBackground(randomNumber)
        const setup = async() => {
            await getFromTMDB('/movie/popular?language=en-US&page=1').then((res)=> setPopularMovies(res.results));
            await getFromTMDB('/tv/popular?language=en-US&page=1').then((res)=> setPopularTV(res.results));
            await getFromTMDB('/trending/all/day?').then((res)=> setTrending(res.results));
            await getFromTMDB('/trending/all/day?').then((res)=> setTrending(res.results));
            await getFromTMDB('/person/popular?language=en-US&page=1').then((res)=> setPopularActor(res.results));
        }
        setup()
    }, [])

    return (
        <div style={{paddingBottom: '100px',}}>
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
                            
                            onClick={()=> console.log(options)}
                            
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '10px',
                                width: '100%',
                                textTransform: 'none',
                            }}
                        >
                            {' '}
                            {options.image_url ?
                            <img
                                style={{ maxWidth: '50px' }}
                                src={options.image_url}
                            />
                            :<Skeleton animation={false} variant="rectangular" width={50} height={75} />
                            }
                            <p style={{ marginLeft: '15px' }}>
                                {options.title}
                            </p>
                            <Link onClick={()=>handlePageTransition(options)} state={{gather:true, type:options.type, id:options.tmdb_id}} to={`media/${options.id}`} style={{color:'#1976d2'}}>
                                <ArrowCircleRightIcon/>
                            </Link>
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
                />
            </div>
            
            <div style={{display:'flex', flexDirection:'column', margin:'15px'}}>
                <h3>Trending</h3>                        
                <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                    { trending ? trending.map( trendingMedia => <FrontPageMedia mediaInfo={trendingMedia} />) : null}
                </div>

                <h3>Popular Movies</h3>                        
                <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                    { popularMovies ? popularMovies.map( movie => <FrontPageMedia mediaInfo={movie} />) : null}
                </div>

                <h3>Popular TV</h3>                        
                <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                    { popularTV ? popularTV.map( tv => <FrontPageMedia mediaInfo={tv} />) : null}
                </div>

                <h3>Popular Actors</h3>                        
                <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px'}}>
                    { popularActor ? popularActor.map( actor => <FrontPageActors actorInfo={actor}/>) : null}
                </div>

                
            </div>
            <Footer />
        </div>
    )
}

export default ManyMedia
