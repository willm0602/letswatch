import { useParams } from 'react-router-dom'
import Footer from './components/footer'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contextSetup'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';
import { Modal } from '@mui/material'
import { Box } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import '../App.css'
import { Link } from 'react-router-dom'
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
    const [LWMediaID, setLWMediaID] = useState(null);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleCloseSnackBar = () => setOpenSnackBar(false);
    const handleOpenSnackBar= (listID) => {
        currentMedia.release_date ? 
            setSnackbarMessage(`Successfully added ${currentMedia.title} to ${userLists.filter(list => list.listID === listID)[0].listName}!`) 
            : 
            setSnackbarMessage(`Successfully added ${currentMedia.name} to ${userLists.filter(list => list.listID === listID)[0].listName}!`)
        setOpenSnackBar(true);
    }
    const handleErrorSnack = () => {
        setSnackbarMessage('Uh oh! there was a problem!')
    }

    const addMediaToList = (listID) => {
        const currentListMembers = userLists.filter(list => list.listID === listID)[0].listMembers;
        const memberCheck = currentListMembers.filter(listMember => listMember.username === ctx.userInfo.username)
        if(memberCheck.length === 0) return;

        const duplicateCheck = userLists.filter(list => list.listID === listID)[0].media.filter(media => media.id === LWMediaID);
        
        if(duplicateCheck.length > 0)
            return;

        const doThing = async() => {
            addMediaToWatchlist(listID, LWMediaID)
                .catch(err => handleErrorSnack())    
                .then(_ => handleOpenSnackBar(listID))
                
            userMetadata().then(res => {
                let lists = []
                res.groups.map(groups => groups.lists.map(list => {
                    console.log(list)
                    if(list.listMembers.some(member => member.username === ctx.userInfo.username))   
                        lists = [...lists, list] 
                }))
                setUserLists(lists.filter( list => !list.media.some(media => media.id === LWMediaID)))
            });
        }
        doThing();
    }

    useEffect(()=>{
        setPageReady(false);
        const setup = async(type, id) => {
            await getFromTMDB(`${type}/${id}`).then((res)=>{
                console.log(res);
                
                const mediaID = res.id;
                const mediaType = res.release_date ? 'movie' : 'tv';
                addMediaByIDAndType(mediaID, mediaType).then(res => {
                    setLWMediaID(res)
                    userMetadata().then(results => {
                        let lists = []                        
                        results.groups.map(groups => groups.lists.map(list => {
                            console.log(list)
                            if(list.listMembers.some(member => member.username === ctx.userInfo.username))   
                                lists = [...lists, list] 
                        }))
                        setUserLists(lists.filter( list => !list.media.some(media => media.id === res)))
                    });
                });


                setCurrentMedia(res);
                getFromTMDB(`${type}/${res.id}/videos?`).then((res)=>{
                    const YTvids = res.results.filter(res => res.site==="YouTube" && res.name.toLowerCase().includes('trailer'));
                    YTvids.length > 0 ? setTrailer(`https://www.youtube.com/embed/${YTvids[0].key}`) : setTrailer(null)
                })
                getFromTMDB(`${type}/${res.id}/credits`).then((res) => { console.log(res); setCast(res.cast)});
                getFromTMDB(`${type}/${res.id}/similar`).then((res) => { console.log(res); setSimilarMedia(res.results); setPageReady(true);});
            })  
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
        <div className = 'footerPadding'>
            <Snackbar open={openSnackBar} anchorOrigin={{vertical:'top', horizontal:'center'}}  autoHideDuration={5000} onClose={handleCloseSnackBar} message={snackbarMessage} />
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
                <Link to='/' style={{ color: 'white', zIndex: '99', margin: '0.5em' }}><h2 style={{margin: '0.3em'}}>Let's Watch</h2></Link>
                <div style={{ display: 'flex', color: 'white', zIndex: '99', margin:'0 5px 0 10%', maxHeight:'250px'}}>
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            marginRight:'25px'
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
                    <div style={{ width: '65%' }}>
                        {currentMedia.title ? (
                            <h4 class='singleMediaHeader'>{currentMedia.title}</h4>
                        ) : (
                            <h4 class='singleMediaHeader'>{currentMedia.name}</h4>
                        )}
                        {currentMedia.release_date ? (
                            <i class='singleMediaHeader'>
                                {currentMedia.release_date.replaceAll('-', '/')}
                            </i>
                        ) : (
                            <i class='singleMediaHeader'>
                                {currentMedia.first_air_date.replaceAll(
                                    '-',
                                    '/'
                                )}
                            </i>
                        )}
                        <p class='singleMediaHeader'>
                            {currentMedia.genres.map((genre) => (
                                <i>{genre.name} </i>
                            ))}
                        </p>
                        <Button
                            onClick={() => handleOpenModal()}
                            variant="contained"
                            style={{
                                marginTop:'10px',
                                maxWidth: '300px',
                                // margin: 'auto',
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
                    <div style={{paddingBottom:'150px'}}>
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