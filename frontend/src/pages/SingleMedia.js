import { useLocation } from 'react-router-dom'
import Footer from './components/footer'
import { useContext, useEffect } from 'react'
import { UserContext } from '../contextSetup'

import {getMediaByID} from '../APIInterface/MediaSearch';

const SingleMedia = () => {
    const location = useLocation()
    // const cm = location.state.chainsawMan
    const ctx = useContext(UserContext)
    const cm = ctx.chainsawMan;

    console.log(cm);


    useEffect(()=>{
        const loadThing = async() => {
            await getMediaByID(345).then((res)=> console.log(res))
        }
        loadThing();
    },[])

    return (
        <div style={{paddingBottom: '100px'}}>
            <div
                style={{
                    backgroundImage: `url(https://www.themoviedb.org/t/p/original${cm.backdrop_path})`,
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
                <h2 style={{ color: 'white', zIndex: '99' }}>Let's Watch</h2>
                <h3 style={{ color: 'white', zIndex: '99' }}>{cm.name}</h3>
                <img
                    style={{ maxWidth: '100px', zIndex: '99' }}
                    src={`https://www.themoviedb.org/t/p/original${cm.poster_path}`}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: '5%',
                    }}
                >
                    <h3>Trailer</h3>

                    <div style={{ maxWidth: '100%' }}>
                        <div className="video-container">
                            <iframe
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/j9sSzNmB5po"
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>

                    <h3>Synopsis</h3>
                    <p>{cm.overview}</p>
                </div>

                {/* 
                    rating
                    date
                    creator?
                    category
                    button
                    synopsis
                    cast
                    posters
                    trailer
                */}
            </div>
            <Footer />
        </div>
    )
}

export default SingleMedia
