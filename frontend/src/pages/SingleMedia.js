import { useParams } from 'react-router-dom'
import Footer from './components/footer'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contextSetup'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal } from '@mui/material'
import { Box } from '@mui/material'

//API
import getFromTMDB from '../APIInterface/TMDB';
import FrontPageRatingBubble from './components/frontPageRatingBubble';
import FrontPageMedia from './components/frontPageMedia';
import { userMetadata } from '../APIInterface/GetUserData';
import { addMediaToWatchlist } from '../APIInterface/WatchList';
import { addMediaByIDAndType, searchForMedia } from '../APIInterface/MediaManagement';

const SingleMedia = () => {

    //get parameters from the url with routes
    let {mediaType, tmdbID} = useParams();
    console.log(mediaType, tmdbID)

    const [currentMedia, setCurrentMedia] = useState(null);
    const ctx = useContext(UserContext)
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState(null);
    const [similarMedia, setSimilarMedia] = useState(null);
    const [pageReady, setPageReady] = useState(false);
    const [userLists, setUserLists] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const addMediaToList = (listID) => {
        console.log(currentMedia);
        const mediaID = currentMedia.id;
        const mediaType = currentMedia.release_date ? 'movie' : 'tv';

        const doThing = async() => {
            await addMediaByIDAndType(mediaID, mediaType).then(res => addMediaToWatchlist(listID, res));
        }
        doThing();
    }

    useEffect(()=>{
        
        setPageReady(false);
        const setup = async(type, id) => {
            await getFromTMDB(`${type}/${id}`).then((res)=>{
                console.log(res);
                setCurrentMedia(res);
                getFromTMDB(`${type}/${res.id}/videos?`).then((res)=>{
                    const YTvids = res.results.filter(res => res.site==="YouTube" && res.name.toLowerCase().includes('trailer'));
                    YTvids.length > 0 ? setTrailer(`https://www.youtube.com/embed/${YTvids[0].key}`) : setTrailer(null)
                })
                getFromTMDB(`${type}/${res.id}/credits`).then((res) => { console.log(res); setCast(res.cast)});
                getFromTMDB(`${type}/${res.id}/similar`).then((res) => { console.log(res); setSimilarMedia(res.results); setPageReady(true);});
            })
            await userMetadata().then(res => {
                let lists = []
                res.groups.map(groups => groups.lists.map(list => lists = [...lists, list] ))
                setUserLists(lists);
            });
            
        }
        if(mediaType && tmdbID)
            setup(mediaType, tmdbID);
    },[mediaType, tmdbID]);

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

    return (
        pageReady ?
        <div style={{paddingBottom: '1350px'}}>
            <div
                style={{
                    backgroundImage: `url(https://www.themoviedb.org/t/p/original${currentMedia.backdrop_path})`,
                    height: '250px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
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
                <h2 style={{ color: 'white', zIndex: '99', margin: '0.5em' }}>
                    Let's Watch
                </h2>
                <div style={{ display: 'flex', color: 'white', zIndex: '99' }}>
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            margin: 'auto',
                        }}
                    >
                        <img
                            style={{ width: '100px' }}
                            src={`https://image.tmdb.org/t/p/original${currentMedia.poster_path}`}
                        />
                        <FrontPageRatingBubble
                            rating={Math.round(currentMedia.vote_average * 10)}
                        />
                    </div>
                    <div style={{ margin: '0 10px', width: '65%' }}>
                        {currentMedia.title ? (
                            <h4 style={{ margin: 0 }}>{currentMedia.title}</h4>
                        ) : (
                            <h2 style={{ margin: 0 }}>{currentMedia.name}</h2>
                        )}
                        {currentMedia.release_date ? (
                            <i style={{ margin: 0 }}>
                                {currentMedia.release_date.replaceAll('-', '/')}
                            </i>
                        ) : (
                            <i style={{ margin: 0 }}>
                                {currentMedia.first_air_date.replaceAll(
                                    '-',
                                    '/'
                                )}
                            </i>
                        )}
                        <p style={{ margin: '0' }}>
                            {currentMedia.genres.map((genre) => (
                                <i>{genre.name} </i>
                            ))}
                        </p>
                        <Button
                            onClick={() => handleOpenModal()}
                            variant="contained"
                            style={{
                                maxWidth: '300px',
                                margin: 'auto',
                                color: '#6C63FF',
                                backgroundColor: 'white',
                                borderRadius: '15px',
                            }}
                        >
                            Add To List
                        </Button>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: '5%',
                    }}
                >
                    <h3 style={{marginTop:'3em'}}>Trailer</h3>
                    
                    {trailer?
                    <div style={{ maxWidth: '100%' }}>
                        <div className="video-container">
                            <iframe
                                width="560"
                                height="315"
                                src={trailer}
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                    :
                    <p>Sorry, no available trailer</p>}

                    <h3>Synopsis</h3>
                    <p>{currentMedia.overview}</p>

                    <h3>Cast</h3>
                    <div>
                        <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px', maxWidth:'350px', alignItems:'start',}}>
                            {cast ?  cast.map(c =>
                                <div style={{display:'flex', flexDirection:'column', margin:'0 10px'}}>
                                    {c.profile_path ?
                                        <img style={{width:'120px'}} src={`https://www.themoviedb.org/t/p/original/${c.profile_path}`}/>
                                        :
                                        <Skeleton variant="rectangular" width={120} height={180} />
                                    }
                                    <b style={{margin:0}}>{c.name}</b>
                                    <i style={{margin:0}}>{c.character}</i>
                                </div>
                            ):null}
                        </div>
                    </div>

                    <h3>Similar Media</h3>
                    <div>
                        <div className='frame' style={{display:'flex', overflow:'scroll', padding:'10px', maxWidth:'350px', alignItems:'start',}}>
                            {similarMedia ?  similarMedia.map(media =>
                                <div style={{display:'flex', flexDirection:'column', margin:'0 10px'}}>
                                    <FrontPageMedia mediaInfo={media} />
                                </div>
                            ):null}
                        </div>
                    </div>                
                </div>
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h2>Add To List</h2>
                    <div style={{display:'flex', flexDirection:'column'}}>
                    {userLists.map(list => 
                        <Button onClick={()=>addMediaToList(list.listID)} style={{color:'white', backgroundColor:'#6C63FF', margin:'5px'}} >{list.listName}</Button>    
                    )}
                    </div>
                </Box>
            </Modal>
            <Footer />
        </div>
        : 
        <div style={{margin:'auto'}}>
            <CircularProgress style={{color:'#6C63FF', width:'100px', height:'100px', display:'flex', margin:'auto', alignItems:'center', height:'800px'}}/>
            <Footer/>
        </div>
    )
}

export default SingleMedia